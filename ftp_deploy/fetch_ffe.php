<?php
// Proxy to fetch FFE player list (bypasses CORS)
header('Access-Control-Allow-Origin: *');
header('Content-Type: text/html; charset=utf-8');

if (!isset($_GET['url'])) {
    http_response_code(400);
    echo "Error: No URL provided";
    exit;
}

$url = $_GET['url'];

// Validate URL is from FFE
if (strpos($url, 'echecs.asso.fr') === false) {
    http_response_code(400);
    echo "Error: URL must be from echecs.asso.fr";
    exit;
}

// Fetch the page with User-Agent
$options = [
    "http" => [
        "header" => "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36\r\n"
    ]
];
$context = stream_context_create($options);
$html = file_get_contents($url, false, $context);

if ($html === false) {
    http_response_code(500);
    echo "Error: Could not fetch URL";
    exit;
}

// Return the HTML
echo $html;
?>
