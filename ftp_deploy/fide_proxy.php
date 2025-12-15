<?php
/**
 * Proxy FIDE "JSON Clean"
 * Récupère le HTML, le nettoie côté serveur, et renvoie du JSON.
 * Résout définitivement les problèmes de parsing "0 joueur trouvé".
 */

// 1. Headers pour autoriser l'accès depuis le JS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=utf-8");
// Désactiver l'affichage des erreurs PHP dans la réponse JSON (sinon ça casse le format)
error_reporting(0);
ini_set('display_errors', 0);

// 2. Validation
$search = isset($_GET['search']) ? trim($_GET['search']) : '';
if (strlen($search) < 3) {
    echo json_encode(['error' => 'Recherche trop courte (min 3 chars)', 'results' => []]);
    exit;
}

// 3. URL FIDE
$url = 'https://ratings.fide.com/incl_search_l.php?search=' . urlencode($search) . '&simple=1';

// 4. Récupération (cURL avec camouflage Navigateur)
$html = false;

if (function_exists('curl_init')) {
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => false,
        // User-Agent d'un vrai Chrome pour éviter le blocage
        CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ]);
    $html = curl_exec($ch);
    curl_close($ch);
}

// Fallback si cURL échoue
if (!$html && ini_get('allow_url_fopen')) {
    $opts = [
        "http" => ["header" => "User-Agent: Mozilla/5.0\r\n"],
        "ssl" => ["verify_peer" => false, "verify_peer_name" => false]
    ];
    $html = @file_get_contents($url, false, stream_context_create($opts));
}

if (!$html) {
    echo json_encode(['error' => 'Erreur connexion FIDE (Serveur)', 'results' => []]);
    exit;
}

// 5. Parsing (Analyse) côté Serveur
$results = [];

// On enveloppe le HTML dans une table pour que DOMDocument le comprenne
// et on force l'encodage UTF-8
$html = '<?xml encoding="UTF-8"><table>' . $html . '</table>';

$dom = new DOMDocument;
libxml_use_internal_errors(true); // Silence les erreurs de HTML mal formé
$dom->loadHTML($html);
libxml_clear_errors();

$xpath = new DOMXPath($dom);
$rows = $xpath->query('//tr');

foreach ($rows as $row) {
    $cols = $row->getElementsByTagName('td');
    
    // FIDE simple renvoie : Nom, Pays, Titre, Elo, Sexe/ID
    if ($cols->length >= 4) {
        $nameNode = $cols->item(0);
        $name = trim($nameNode->textContent);
        
        // Ignorer la ligne d'en-tête
        if (stripos($name, 'Name') !== false) continue;

        // Extraction FIDE ID (souvent dans le lien href ou colonne 5)
        $fideId = '';
        $links = $nameNode->getElementsByTagName('a');
        if ($links->length > 0) {
            $href = $links->item(0)->getAttribute('href');
            if (preg_match('/id=(\d+)/', $href, $matches)) {
                $fideId = $matches[1];
            }
        }
        if (!$fideId && $cols->length > 4) {
            $fideId = trim($cols->item(4)->textContent);
            // Nettoyage des espaces insécables (&nbsp;)
            $fideId = str_replace("\xc2\xa0", "", $fideId); 
        }

        $results[] = [
            'name'   => $name,
            'fed'    => trim($cols->item(1)->textContent),
            'title'  => trim($cols->item(2)->textContent),
            'rating' => trim($cols->item(3)->textContent),
            'fideId' => $fideId
        ];
    }
}

// 6. Renvoi du JSON propre
echo json_encode(['success' => true, 'results' => $results]);
?>