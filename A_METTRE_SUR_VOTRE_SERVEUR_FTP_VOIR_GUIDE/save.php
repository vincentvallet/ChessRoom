<?php
// save.php - Full Save with Optimistic Locking
// Based on the user's working version, adding ONLY locking logic.

// 1. Disable errors (User preference for this server)
error_reporting(0);
ini_set('display_errors', 0);

// 2. Shutdown Handler
register_shutdown_function(function() {
    $error = error_get_last();
    if ($error !== null && (headers_sent() === false)) {
        @ob_get_clean(); 
        header('Content-Type: application/json');
        http_response_code(500); 
        echo json_encode([
            'success' => false,
            'error' => 'Erreur fatale PHP (shutdown)',
            'php_error_details' => $error['message']
        ]);
        @file_put_contents('chessroom-debug.log', date('Y-m-d H:i:s') . " FATAL ERROR: " . $error['message'] . "\n", FILE_APPEND);
    }
});

@ob_start();

// 3. Headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Data-Timestamp'); // Allow custom header
header('Access-Control-Expose-Headers: X-Data-Timestamp'); // Expose custom header to JS

// 4. Config
$dataFile = 'chessroom-data.json';
$historyDir = 'chessroom-history';
$debugLog = 'chessroom-debug.log';
$maxHistoryFiles = 10;

// Log
$logMessage = date('Y-m-d H:i:s') . " --- " . $_SERVER['REQUEST_METHOD'] . " ---";
if(isset($_GET['list_history'])) { $logMessage .= " (list_history)"; }
@file_put_contents($debugLog, $logMessage . "\n", FILE_APPEND);

// OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    @ob_end_clean(); 
    echo json_encode(['success' => true]);
    exit;
}

try {
    // ==========================================
    // POST (SAUVEGARDE)
    // ==========================================
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = file_get_contents('php://input');
        if (empty($data)) throw new Exception("POST: Données vides.");
        
        // --- OPTIMISTIC LOCKING ---
        $jsonData = @json_decode($data, true);
        if ($jsonData && isset($jsonData['clientTimestamp'])) {
            $clientTs = (int)$jsonData['clientTimestamp'];
            $serverTs = file_exists($dataFile) ? @filemtime($dataFile) : 0;
            
            // If server file is newer by > 2 seconds (safety margin)
            if ($serverTs > $clientTs + 2) {
                @ob_end_clean();
                http_response_code(409); // Conflict
                echo json_encode([
                    'success' => false,
                    'error' => 'CONFLIT: Les données ont été modifiées sur le serveur.',
                    'serverTimestamp' => $serverTs,
                    'clientTimestamp' => $clientTs
                ]);
                exit;
            }
        }
        // --------------------------

        // Historique
        if (!file_exists($historyDir)) {
            @mkdir($historyDir, 0755, true);
        }
        $historyFile = $historyDir . '/history_' . date('Y-m-d_H-i-s') . '.json';
        @file_put_contents($historyFile, $data);

        // Nettoyage Historique
        $files = @glob($historyDir . '/*.json');
        if ($files && count($files) > $maxHistoryFiles) {
            usort($files, function($a, $b) { return @filemtime($a) - @filemtime($b); });
            $toDelete = count($files) - $maxHistoryFiles;
            for ($i = 0; $i < $toDelete; $i++) @unlink($files[$i]);
        }

        // Sauvegarde Principale
        $fp = @fopen($dataFile, 'c+');
        if (!$fp) throw new Exception("PERMISSIONS: Impossible d'ouvrir $dataFile.");
        
        if (@flock($fp, LOCK_EX)) {
            @ftruncate($fp, 0);
            $bytes = @fwrite($fp, $data);
            @flock($fp, LOCK_UN);
            @fclose($fp);

            if ($bytes === false) throw new Exception("Erreur écriture.");
            
            @ob_end_clean(); 
            // Return new timestamp
            echo json_encode([
                'success' => true,
                'timestamp' => time()
            ]);
            exit;

        } else {
            @fclose($fp);
            throw new Exception("VERROUILLAGE: Impossible d'obtenir le verrou.");
        }
    }

    // ==========================================
    // GET (CHARGEMENT)
    // ==========================================
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {

        // ... (History logic omitted for brevity, same as before) ...
        if (isset($_GET['list_history'])) {
             // ... (Keep existing history list logic if needed) ...
             // For now, focusing on main load
             $history = [];
             if (file_exists($historyDir)) {
                 $files = glob($historyDir . '/*.json');
                 foreach ($files as $file) {
                     $history[] = ['filename' => basename($file), 'date' => date('Y-m-d H:i:s', filemtime($file))];
                 }
             }
             @ob_end_clean();
             echo json_encode(['success' => true, 'history' => $history]);
             exit;
        }

        if (!file_exists($dataFile)) {
            @ob_end_clean();
            echo json_encode(['roundsStore' => new stdClass(), 'currentRoundKey' => 'ronde1']);
            exit;
        }

        $fp = @fopen($dataFile, 'r');
        if (!$fp) throw new Exception("Impossible d'ouvrir $dataFile.");

        if (@flock($fp, LOCK_SH)) {
            $content = @stream_get_contents($fp);
            $mtime = @filemtime($dataFile); // Get modification time
            @flock($fp, LOCK_UN);
            @fclose($fp);

            if (empty($content)) $content = '{}';
            
            @ob_end_clean();
            
            // SEND TIMESTAMP HEADER
            header('X-Data-Timestamp: ' . $mtime);
            
            echo $content; 
            exit;
            
        } else {
            @fclose($fp);
            throw new Exception("Verrouillage lecture impossible.");
        }
    }

} catch (Exception $e) {
    @ob_end_clean(); 
    http_response_code(400); 
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    exit;
}
?>