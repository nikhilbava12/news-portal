<?php
// Admin API Endpoints - Complete Backend for Admin Panel
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $segments[1] ?? '';
$id = $segments[2] ?? null;

// Helper function to send JSON response
function jsonResponse($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

// Helper function to authenticate admin
function authenticateAdmin($pdo) {
    $headers = getallheaders();
    $token = $headers['Authorization'] ?? '';
    $token = str_replace('Bearer ', '', $token);
    
    if (empty($token)) {
        jsonResponse(['error' => 'Unauthorized'], 401);
    }
    return true;
}

switch ($action) {
    case 'login':
        if ($method !== 'POST') jsonResponse(['error' => 'Method not allowed'], 405);
        
        $data = json_decode(file_get_contents('php://input'), true);
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';
        
        $stmt = $pdo->prepare("SELECT * FROM admin WHERE email = ?");
        $stmt->execute([$email]);
        $admin = $stmt->fetch();
        
        if (!$admin || !password_verify($password, $admin['password_hash'])) {
            jsonResponse(['error' => 'Invalid credentials'], 401);
        }
        
        $token = bin2hex(random_bytes(32));
        jsonResponse(['success' => true, 'token' => $token, 'user' => ['id' => $admin['id'], 'name' => $admin['name'], 'email' => $admin['email']]]);
        break;

    case 'stats':
        authenticateAdmin($pdo);
        if ($method !== 'GET') jsonResponse(['error' => 'Method not allowed'], 405);
        
        $newsCount = $pdo->query("SELECT COUNT(*) as count FROM news")->fetch()['count'];
        $categoriesCount = $pdo->query("SELECT COUNT(*) as count FROM categories")->fetch()['count'];
        $totalViews = $pdo->query("SELECT SUM(views) as total FROM news")->fetch()['total'] ?? 0;
        $newMessages = $pdo->query("SELECT COUNT(*) as count FROM messages WHERE status = 'new'")->fetch()['count'];
        
        jsonResponse(['stats' => ['totalNews' => (int)$newsCount, 'totalCategories' => (int)$categoriesCount, 'totalViews' => (int)$totalViews, 'newMessages' => (int)$newMessages]]);
        break;

    default:
        jsonResponse(['error' => 'Action not found'], 404);
}
