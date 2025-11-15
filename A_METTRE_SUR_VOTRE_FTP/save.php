<?php
// Version DEBUG avec logs détaillés
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', 'chessroom-errors.log');

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

// Configuration
$dataFile = 'chessroom-data.json';
$historyDir = 'chessroom-history';
$lockFile = 'chessroom.lock';
$maxHistoryFiles = 50;

// Log de debug
function debugLog($message) {
    $logFile = 'chessroom-debug.log';
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
}

debugLog("=== Nouvelle requête ===");
debugLog("Méthode: " . $_SERVER['REQUEST_METHOD']);

// Traiter les requêtes OPTIONS (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    debugLog("Requête OPTIONS - Réponse 200");
    http_response_code(200);
    exit;
}

// SAUVEGARDER (POST)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    debugLog("POST - Tentative de sauvegarde");
    
    try {
        // Lire les données
        $data = file_get_contents('php://input');
        debugLog("Données reçues: " . strlen($data) . " bytes");
        
        // Vérifier JSON
        $decoded = json_decode($data);
        if (json_last_error() !== JSON_ERROR_NONE) {
            debugLog("ERREUR: JSON invalide - " . json_last_error_msg());
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'JSON invalide: ' . json_last_error_msg()
            ]);
            exit;
        }
        
        debugLog("JSON valide");
        
        // Créer le dossier d'historique si nécessaire
        if (!file_exists($historyDir)) {
            debugLog("Création du dossier $historyDir");
            if (!mkdir($historyDir, 0755, true)) {
                debugLog("ERREUR: Impossible de créer le dossier $historyDir");
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'error' => "Impossible de créer le dossier $historyDir"
                ]);
                exit;
            }
        }
        
        // Vérifier les permissions d'écriture
        if (!is_writable(dirname($dataFile))) {
            debugLog("ERREUR: Pas de permission d'écriture dans " . dirname($dataFile));
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Pas de permission d\'écriture'
            ]);
            exit;
        }
        
        // Sauvegarder dans l'historique
        $timestamp = date('Y-m-d_H-i-s');
        $tournamentName = isset($decoded->tournamentName) ? 
            preg_replace('/[^a-zA-Z0-9_-]/', '_', $decoded->tournamentName) : 
            'tournoi';
        $historyFile = $historyDir . '/' . $tournamentName . '_' . $timestamp . '.json';
        
        debugLog("Sauvegarde historique: $historyFile");
        if (!file_put_contents($historyFile, $data)) {
            debugLog("ERREUR: Échec sauvegarde historique");
        } else {
            debugLog("Historique OK");
        }
        
        // Sauvegarder le fichier principal (AVEC VERROUILLAGE)
        debugLog("Sauvegarde fichier principal: $dataFile");

        // 1. Ouvrir le fichier (mode 'c+' = crée s'il n'existe pas, place le pointeur au début)
        $fp = fopen($dataFile, 'c+');

        if ($fp === false) {
            // Erreur si on ne peut même pas ouvrir le fichier
            debugLog("ERREUR: Impossible d'ouvrir le fichier $dataFile");
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Impossible d\'ouvrir le fichier de données']);
        
        } else {
            // 2. Demander un VERROU EXCLUSIF (LOCK_EX)
            // Le script va s'arrêter ici et ATTENDRE si un autre script a déjà le verrou.
            if (flock($fp, LOCK_EX)) {
                debugLog("Verrou acquis sur $dataFile");

                // 3. Vider le fichier (car 'c+' n'efface pas le contenu précédent)
                ftruncate($fp, 0);

                // 4. Écrire les nouvelles données
                $bytesWritten = fwrite($fp, $data);

                // 5. RELÂCHER LE VERROU (très important !)
                flock($fp, LOCK_UN);
                debugLog("Verrou relâché");

                // 6. Fermer le fichier
                fclose($fp);

                // Gérer le succès ou l'échec de l'écriture
                if ($bytesWritten !== false) {
                    debugLog("SUCCESS: Sauvegarde réussie (" . $bytesWritten . " bytes)");
                    echo json_encode([
                        'success' => true,
                        'message' => 'Données sauvegardées',
                        'timestamp' => time(),
                        'historyFile' => basename($historyFile),
                        'debug' => 'OK (Locked)' // Indique que le verrou a fonctionné
                    ]);
                } else {
                    debugLog("ERREUR: Échec d'écriture (fwrite)");
                    http_response_code(500);
                    echo json_encode(['success' => false, 'error' => 'Impossible d\'écrire dans le fichier (fwrite)']);
                }

            } else {
                // Si on n'a pas pu obtenir le verrou
                debugLog("ERREUR: Impossible d'obtenir le verrou sur $dataFile");
                http_response_code(500); // 500 = Erreur serveur
                echo json_encode(['success' => false, 'error' => 'Impossible de verrouiller le fichier de données']);
                fclose($fp); // Fermer quand même
            }
        }
        
    } catch (Exception $e) {
        debugLog("EXCEPTION: " . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Exception: ' . $e->getMessage()
        ]);
    }
}

// CHARGER (GET)
elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    debugLog("GET - Chargement des données");

    // ==========================================================
    // NOUVEAU: GESTION DE LA SUPPRESSION
    // ==========================================================
    
    // --- Gérer la suppression d'un seul fichier ---
    if (isset($_GET['delete'])) {
        debugLog("Demande de suppression: " . $_GET['delete']);
        
        // SÉCURITÉ: Valider le nom du fichier pour éviter le "Path Traversal"
        // basename() retire tous les '..', '/', etc.
        $fileToDelete = basename($_GET['delete']); 
        
        // SÉCURITÉ: S'assurer qu'on ne supprime que des .json
        if (substr($fileToDelete, -5) !== '.json') {
            debugLog("ERREUR: Nom de fichier invalide (pas .json)");
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Nom de fichier invalide']);
            exit;
        }

        $filePath = $historyDir . '/' . $fileToDelete;

        // SÉCURITÉ: Vérifier que le fichier est bien dans le dossier d'historique
        if (file_exists($filePath) && realpath($filePath) === $filePath && strpos($filePath, $historyDir) === 0) {
            if (unlink($filePath)) {
                debugLog("Fichier supprimé: " . $filePath);
                echo json_encode(['success' => true, 'message' => 'Fichier ' . $fileToDelete . ' supprimé.']);
            } else {
                debugLog("ERREUR: Impossible de supprimer " . $filePath);
                http_response_code(500);
                echo json_encode(['success' => false, 'error' => 'Impossible de supprimer le fichier']);
            }
        } else {
            debugLog("ERREUR: Fichier introuvable ou chemin invalide: " . $filePath);
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Fichier non trouvé ou non autorisé']);
        }
        exit;
    }
    
    // --- Gérer la suppression de TOUT l'historique ---
    if (isset($_GET['delete_all']) && $_GET['delete_all'] === 'true') {
        debugLog("Demande de suppression de TOUT l'historique");
        $files = glob($historyDir . '/*.json');
        $count = 0;
        $errors = 0;
        foreach ($files as $file) {
            if (unlink($file)) {
                $count++;
            } else {
                $errors++;
            }
        }
        debugLog($count . " fichiers supprimés, " . $errors . " erreurs.");
        echo json_encode(['success' => true, 'message' => $count . ' fichiers supprimés.']);
        exit;
    }

    // ==========================================================
    // FIN DE LA NOUVELLE GESTION
    // ==========================================================

    // Liste historique
    if (isset($_GET['list_history'])) {
        debugLog("Demande de liste historique");
        if (!file_exists($historyDir)) {
            echo json_encode(['success' => true, 'history' => []]);
            exit;
        }
        
        $files = glob($historyDir . '/*.json');
        $history = [];
        foreach ($files as $file) {
            $history[] = [
                'filename' => basename($file),
                'timestamp' => filemtime($file),
                'date' => date('Y-m-d H:i:s', filemtime($file)),
                'size' => filesize($file)
            ];
        }
        usort($history, function($a, $b) {
            return $b['timestamp'] - $a['timestamp'];
        });
        
        debugLog("Liste historique: " . count($history) . " fichiers");
        echo json_encode(['success' => true, 'history' => $history]);
        exit;
    }
    
    // Charger fichier spécifique d'historique
    if (isset($_GET['history'])) {
        $historyFile = basename($_GET['history']);
        $filePath = $historyDir . '/' . $historyFile;
        debugLog("Chargement historique: $filePath");
        
        if (file_exists($filePath)) {
            $data = file_get_contents($filePath);
            echo $data;
        } else {
            debugLog("ERREUR: Fichier historique introuvable");
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Fichier introuvable']);
        }
        exit;
    }
    
    // Charger le fichier principal
    if (file_exists($dataFile)) {
        debugLog("Chargement fichier principal: $dataFile");
        $data = file_get_contents($dataFile);
        echo $data;
    } else {
        debugLog("Aucune sauvegarde - Renvoi données vides");
        echo json_encode([
            'roundsStore' => new stdClass(),
            'currentRoundKey' => 'ronde1',
            'arbiterPassword' => null,
            'tournamentName' => ''
        ]);
    }
}

else {
    debugLog("Méthode non autorisée: " . $_SERVER['REQUEST_METHOD']);
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Méthode non autorisée'
    ]);
}

debugLog("=== Fin requête ===\n");
?>