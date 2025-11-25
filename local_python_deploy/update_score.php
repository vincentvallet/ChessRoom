<?php
// update_score.php - Atomic Score Update
// Handles ONLY score updates to prevent overwriting other data.

// 1. Disable errors to prevent 500 on strict servers
error_reporting(0);
ini_set('display_errors', 0);

// 2. Headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// 3. Config
$dataFile = 'chessroom-data.json';

// 4. Handle OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    echo json_encode(['success' => true]);
    exit;
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Method not allowed");
    }

    $input = file_get_contents('php://input');
    if (empty($input)) throw new Exception("No data");

    $data = @json_decode($input, true);
    if (!$data) throw new Exception("Invalid JSON");

    if (!isset($data['roundKey']) || !isset($data['boardNumber'])) {
        throw new Exception("Missing parameters");
    }

    $roundKey = $data['roundKey'];
    $boardNum = (string)$data['boardNumber'];
    $result = $data['result'] ?? ""; // "1-0", "0-1", "1/2-1/2", or ""

    // 5. Atomic File Operation
    $fp = @fopen($dataFile, 'c+');
    if (!$fp) throw new Exception("Cannot open data file");

    if (@flock($fp, LOCK_EX)) {
        $content = @stream_get_contents($fp);
        $db = empty($content) ? ['roundsStore' => []] : json_decode($content, true);
        
        $found = false;
        
        // Locate and update the specific board
        if (isset($db['roundsStore'][$roundKey]['physicalTables'])) {
            foreach ($db['roundsStore'][$roundKey]['physicalTables'] as &$table) {
                if (isset($table['boards'])) {
                    foreach ($table['boards'] as &$board) {
                        if ((string)$board['boardNumber'] === $boardNum) {
                            // Update Score
                            if ($result === "") {
                                $board['score'] = ['white' => "", 'black' => ""];
                            } else {
                                $parts = explode('-', $result);
                                $board['score'] = [
                                    'white' => $parts[0] ?? "",
                                    'black' => $parts[1] ?? ""
                                ];
                            }
                            $found = true;
                            break 2; // Break both loops
                        }
                    }
                }
            }
        }

        if ($found) {
            @ftruncate($fp, 0);
            @rewind($fp);
            @fwrite($fp, json_encode($db));
            @fflush($fp);
            $success = true;
            $msg = "Score updated";
        } else {
            $success = false;
            $msg = "Board not found";
        }

        @flock($fp, LOCK_UN);
        @fclose($fp);

        echo json_encode(['success' => $success, 'message' => $msg]);

    } else {
        @fclose($fp);
        throw new Exception("Could not lock file");
    }

} catch (Exception $e) {
    http_response_code(200); // Return 200 with error message to avoid generic 500
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
