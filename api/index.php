<?php
require_once __DIR__ . '/cors.php';
ini_set('display_errors', 1);
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    require_once __DIR__ . '/db.php';
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to load database: ' . $e->getMessage()]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$basePrefix = '/news-portal/api/';
$pos = strpos($uri, $basePrefix);
$path = $pos === false ? $uri : substr($uri, $pos + strlen($basePrefix));
$path = ltrim($path, '/');
// Support calling through index.php without mod_rewrite:
// /news/news-portal/api/index.php/news
// /news/news-portal/api/index.php/news/123
if (str_starts_with($path, 'index.php')) {
    $path = substr($path, strlen('index.php'));
    $path = ltrim($path, '/');
}
$path = trim($path, '/');
$segments = $path === '' ? [] : explode('/', $path);

// Allow calling admin routes without /admin path via query param:
// index.php?admin=categories
// index.php?admin=login
// index.php?admin=news&id=123
if (!empty($_GET['admin'])) {
    $adminAction = trim((string)$_GET['admin'], '/');
    $adminId = $_GET['id'] ?? null;

    $segments = array_values(array_filter([
        'admin',
        $adminAction,
        $adminId
    ], fn($v) => $v !== null && $v !== ''));
}

$endpoint = $segments[0] ?? '';
$id = $segments[1] ?? null;

if ($endpoint === '') {
    echo json_encode([
        'status' => 'ok',
        'message' => 'News Portal API',
        'endpoints' => [
            'GET index.php/categories',
            'GET index.php/breaking',
            'GET index.php/trending',
            'GET index.php/popular',
            'GET index.php/featured',
            'GET index.php/news?page=1&limit=10',
            'GET index.php/news/{id}'
        ]
    ]);
    exit;
}

switch ($endpoint) {
    case 'news':
        require_once __DIR__ . '/endpoints/news.php';
        break;
    case 'categories':
        require_once __DIR__ . '/endpoints/categories.php';
        break;
    case 'trending':
        require_once __DIR__ . '/endpoints/trending.php';
        break;
    case 'popular':
        require_once __DIR__ . '/endpoints/popular.php';
        break;
    case 'featured':
        require_once __DIR__ . '/endpoints/featured.php';
        break;
    case 'breaking':
        require_once __DIR__ . '/endpoints/breaking.php';
        break;
    case 'admin':
        require_once __DIR__ . '/endpoints/admin.php';
        break;
    case 'upload':
        require_once __DIR__ . '/endpoints/upload.php';
        break;
    case 'contact':
        require_once __DIR__ . '/endpoints/contact.php';
        break;
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found', 'requested' => $endpoint]);
}
