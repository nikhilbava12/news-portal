<?php
// Contact Form API Endpoint
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';

$method = $_SERVER['REQUEST_METHOD'];

function jsonResponse($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Validate required fields
    if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
        jsonResponse(['error' => 'Name, email, and message are required'], 400);
    }
    
    // Validate email
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        jsonResponse(['error' => 'Invalid email address'], 400);
    }
    
    try {
        global $pdo;
        
        $stmt = $pdo->prepare("INSERT INTO messages (name, email, subject, message, status, created_at) VALUES (?, ?, ?, ?, 'new', NOW())");
        $stmt->execute([
            $data['name'] ?? '',
            $data['email'] ?? '',
            $data['subject'] ?? 'Contact Form Submission',
            $data['message'] ?? ''
        ]);
        
        jsonResponse([
            'success' => true,
            'message' => 'Contact form submitted successfully',
            'id' => $pdo->lastInsertId()
        ]);
        
    } catch (Exception $e) {
        jsonResponse(['error' => 'Failed to submit contact form'], 500);
    }
} else {
    jsonResponse(['error' => 'Method not allowed'], 405);
}
?>
