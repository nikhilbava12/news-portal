<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Get all active categories with news count
        $stmt = $pdo->query("
            SELECT c.*, COUNT(n.news_id) as news_count
            FROM categories c
            LEFT JOIN news n ON c.id = n.category_id AND n.status = 'published'
            WHERE c.status = 'active'
            GROUP BY c.id
            ORDER BY c.name
        ");
        
        echo json_encode($stmt->fetchAll());
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
