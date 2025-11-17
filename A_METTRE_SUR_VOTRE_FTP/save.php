<?php
// VERSION "NUCLÉAIRE" - ANTI-CRASH
// Mettez ceci en place, et si ça ne marche pas, le problème est 100% les permissions de fichiers.

// ÉTAPE 1: DÉSACTIVER LES ERREURS IMMÉDIATEMENT
error_reporting(0);
ini_set('display_errors', 0);

// ÉTAPE 2: GESTIONNAIRE DE DERNIER RECOURS
// Si le script plante (erreur fatale), ceci essaiera d'envoyer du JSON
register_shutdown_function(function() {
    $error = error_get_last();
    if ($error !== null && (headers_sent() === false)) {
        // Une erreur fatale s'est produite et rien n'a encore été envoyé
        @ob_get_clean(); // Nettoyer toute sortie partielle
        header('Content-Type: application/json');
        http_response_code(500); // Erreur serveur
        echo json_encode([
            'success' => false,
            'error' => 'Erreur fatale PHP (shutdown)',
            'php_error_details' => $error['message'] . ' on line ' . $error['line']
        ]);
        
        // Logguer l'erreur fatale
        @file_put_contents('chessroom-debug.log', date('Y-m-d H:i:s') . " FATAL ERROR: " . $error['message'] . "\n", FILE_APPEND);
    }
});

// ÉTAPE 3: DÉMARRER LE BUFFER
// Ceci capture tout "echo" ou "warning" que error_reporting(0) n'aurait pas attrapé.
@ob_start();

// ÉTAPE 4: HEADERS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// ÉTAPE 5: CONFIG
$dataFile = 'chessroom-data.json';
$historyDir = 'chessroom-history';
$debugLog = 'chessroom-debug.log';

// Log (on utilise @ pour ne pas crasher si le log n'est pas inscriptible)
$logMessage = date('Y-m-d H:i:s') . " --- " . $_SERVER['REQUEST_METHOD'] . " ---";
if(isset($_GET['list_history'])) { $logMessage .= " (list_history)"; }
if(isset($_GET['delete'])) { $logMessage .= " (delete)"; }
@file_put_contents($debugLog, $logMessage . "\n", FILE_APPEND);

// Gérer OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    @ob_end_clean(); // Nettoyer et finir
    echo json_encode(['success' => true, 'method' => 'OPTIONS']);
    exit;
}

// --- LOGIQUE PRINCIPALE ---
try {
    // Gérer POST (SAUVEGARDE)
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = file_get_contents('php://input');
        if (empty($data)) {
            throw new Exception("POST: Données vides reçues.");
        }
        
        // Écrire dans l'historique (bonus, on utilise @ pour ignorer les erreurs)
        if (!file_exists($historyDir)) {
            if (@mkdir($historyDir, 0755, true) === false) {
                @file_put_contents($debugLog, date('Y-m-d H:i:s') . " PERMISSION: Impossible de créer $historyDir.\n", FILE_APPEND);
            }
        }
        $historyFile = $historyDir . '/history_' . date('Y-m-d_H-i-s') . '.json';
        @file_put_contents($historyFile, $data);

        // Écrire dans le fichier principal (OBLIGATOIRE)
        $fp = @fopen($dataFile, 'c+');
        if (!$fp) {
            throw new Exception("PERMISSIONS: Impossible d'ouvrir le fichier $dataFile. Vérifiez les droits d'écriture (CHMOD).");
        }
        
        if (@flock($fp, LOCK_EX)) {
            @ftruncate($fp, 0);
            $bytes = @fwrite($fp, $data);
            @flock($fp, LOCK_UN);
            @fclose($fp);

            if ($bytes === false || $bytes === 0) {
                 throw new Exception("PERMISSIONS: Écriture 0 byte dans $dataFile. Disque plein ou permissions ?");
            }
            
            @file_put_contents($debugLog, date('Y-m-d H:i:s') . " POST: OK (" . $bytes . " bytes)\n", FILE_APPEND);
            @ob_end_clean(); // Tout nettoyer avant d'envoyer
            echo json_encode([
                'success' => true,
                'message' => 'Données sauvegardées',
                'timestamp' => time()
            ]);
            exit;

        } else {
            @fclose($fp);
            throw new Exception("VERROUILLAGE: Impossible d'obtenir le verrou sur $dataFile.");
        }
    }

    // Gérer GET (CHARGEMENT)
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {

        // Logique de l'historique (simplifiée pour le test)
        if (isset($_GET['list_history'])) {
            $history = [];
            if (file_exists($historyDir) && is_readable($historyDir)) {
                $files = glob($historyDir . '/*.json');
                foreach ($files as $file) {
                    $history[] = [
                        'filename' => basename($file),
                        'timestamp' => filemtime($file),
                        'date' => date('Y-m-d H:i:s', filemtime($file)),
                        'size' => filesize($file)
                    ];
                }
                usort($history, function($a, $b) { return $b['timestamp'] - $a['timestamp']; });
            }
            @file_put_contents($debugLog, date('Y-m-d H:i:s') . " GET: Liste historique OK (" . count($history) . ")\n", FILE_APPEND);
            @ob_end_clean();
            echo json_encode(['success' => true, 'history' => $history]);
            exit;
        }
        
        // ... (La logique de suppression et de chargement d'historique est omise pour ce test) ...
        if (isset($_GET['delete']) || isset($_GET['delete_all']) || isset($_GET['history'])) {
             throw new Exception("GET: La suppression/chargement d'historique est temporairement désactivée pour ce test.");
        }


        // CHARGER LE FICHIER PRINCIPAL
        if (!file_exists($dataFile)) {
            @file_put_contents($debugLog, date('Y-m-d H:i:s') . " GET: Fichier non trouvé. Envoi JSON vide.\n", FILE_APPEND);
            @ob_end_clean();
            echo json_encode(['roundsStore' => new stdClass(), 'currentRoundKey' => 'ronde1']);
            exit;
        }

        $fp = @fopen($dataFile, 'r');
        if (!$fp) {
            throw new Exception("PERMISSIONS: Impossible d'ouvrir $dataFile en lecture.");
        }

        if (@flock($fp, LOCK_SH)) {
            $data = @stream_get_contents($fp);
            @flock($fp, LOCK_UN);
            @fclose($fp);

            if (empty($data)) {
                $data = '{"roundsStore": {}, "currentRoundKey": "ronde1"}';
            }
            
            @file_put_contents($debugLog, date('Y-m-d H:i:s') . " GET: OK (" . strlen($data) . " bytes)\n", FILE_APPEND);
            @ob_end_clean(); // Nettoyer
            echo $data; // Envoyer le JSON brut
            exit;
            
        } else {
            @fclose($fp);
            throw new Exception("VERROUILLAGE: Impossible d'obtenir le verrou de lecture sur $dataFile.");
        }
    }

    // Gérer les autres méthodes
    throw new Exception("Méthode " . $_SERVER['REQUEST_METHOD'] . " non autorisée.");

} catch (Exception $e) {
    // Gérer toutes les "exceptions" que nous avons créées
    @file_put_contents($debugLog, date('Y-m-d H:i:s') . " EXCEPTION: " . $e->getMessage() . "\n", FILE_APPEND);
    @ob_end_clean(); // Nettoyer les erreurs
    http_response_code(400); // Bad Request ou erreur
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
    exit;
}

?>