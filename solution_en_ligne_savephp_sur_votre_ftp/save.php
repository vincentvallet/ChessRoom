<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

// Nom du fichier de sauvegarde
$dataFile = 'chessroom-data.json';

// Traiter les requêtes OPTIONS (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// SAUVEGARDER (POST)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Lire les données envoyées
    $data = file_get_contents('php://input');
    
    // Vérifier que c'est du JSON valide
    $decoded = json_decode($data);
    if (json_last_error() === JSON_ERROR_NONE) {
        // Sauvegarder dans le fichier
        if (file_put_contents($dataFile, $data)) {
            echo json_encode([
                'success' => true,
                'message' => 'Données sauvegardées',
                'timestamp' => time()
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Impossible d\'écrire le fichier'
            ]);
        }
    } else {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'JSON invalide'
        ]);
    }
}

// CHARGER (GET)
elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Vérifier si le fichier existe
    if (file_exists($dataFile)) {
        // Lire et renvoyer les données
        $data = file_get_contents($dataFile);
        
        // Vérifier que c'est du JSON valide
        $decoded = json_decode($data);
        if (json_last_error() === JSON_ERROR_NONE) {
            echo $data;
        } else {
            // Si le fichier est corrompu, renvoyer données vides
            echo json_encode([
                'roundsStore' => new stdClass(),
                'currentRoundKey' => 'ronde1',
                'arbiterPassword' => null
            ]);
        }
    } else {
        // Si pas de sauvegarde, renvoyer données vides
        echo json_encode([
            'roundsStore' => new stdClass(),
            'currentRoundKey' => 'ronde1',
            'arbiterPassword' => null
        ]);
    }
}

else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Méthode non autorisée'
    ]);
}
?>
