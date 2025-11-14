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
        
        // Sauvegarder le fichier principal
        debugLog("Sauvegarde fichier principal: $dataFile");
        if (file_put_contents($dataFile, $data)) {
            debugLog("SUCCESS: Sauvegarde réussie");
            echo json_encode([
                'success' => true,
                'message' => 'Données sauvegardées',
                'timestamp' => time(),
                'historyFile' => basename($historyFile),
                'debug' => 'OK'
            ]);
        } else {
            debugLog("ERREUR: Échec sauvegarde fichier principal");
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Impossible d\'écrire le fichier'
            ]);
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
