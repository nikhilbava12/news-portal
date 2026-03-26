<?php
// Admin API Endpoints - Complete Backend for Admin Panel
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $segments[1] ?? '';
$id = $segments[2] ?? null;

function jsonResponse($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function authenticateAdmin($pdo) {
    $headers = getallheaders();
    $token = str_replace('Bearer ', '', $headers['Authorization'] ?? '');
    if (empty($token)) jsonResponse(['error' => 'Unauthorized'], 401);
    return true;
}

function generateSlug($text) {
    return strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $text), '-'));
}

switch ($action) {
    // ==================== AUTHENTICATION ====================
    case 'login':
        if ($method !== 'POST') jsonResponse(['error' => 'Method not allowed'], 405);
        
        $data = json_decode(file_get_contents('php://input'), true);
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';
        
        if (empty($email) || empty($password)) {
            jsonResponse(['error' => 'Email and password required'], 400);
        }
        
        $stmt = $pdo->prepare("SELECT * FROM admin WHERE email = ?");
        $stmt->execute([$email]);
        $admin = $stmt->fetch();
        
        if (!$admin || !password_verify($password, $admin['password_hash'])) {
            jsonResponse(['error' => 'Invalid credentials'], 401);
        }
        
        $token = bin2hex(random_bytes(32));
        jsonResponse([
            'success' => true,
            'token' => $token,
            'user' => [
                'id' => $admin['id'],
                'name' => $admin['name'],
                'email' => $admin['email']
            ]
        ]);
        break;

    // ==================== DASHBOARD STATS ====================
    case 'stats':
        authenticateAdmin($pdo);
        if ($method !== 'GET') jsonResponse(['error' => 'Method not allowed'], 405);
        
        $newsCount = (int)$pdo->query("SELECT COUNT(*) FROM news")->fetchColumn();
        $categoriesCount = (int)$pdo->query("SELECT COUNT(*) FROM categories")->fetchColumn();
        $totalViews = (int)($pdo->query("SELECT SUM(views) FROM news")->fetchColumn() ?? 0);
        $newMessages = (int)$pdo->query("SELECT COUNT(*) FROM messages WHERE status = 'new'")->fetchColumn();
        
        jsonResponse([
            'success' => true,
            'stats' => [
                'totalNews' => $newsCount,
                'totalCategories' => $categoriesCount,
                'totalViews' => $totalViews,
                'newMessages' => $newMessages
            ]
        ]);
        break;

    // ==================== NEWS CRUD ====================
    case 'news':
        authenticateAdmin($pdo);
        
        if ($method === 'GET') {
            $page = max(1, (int)($_GET['page'] ?? 1));
            $limit = max(1, min(100, (int)($_GET['limit'] ?? 10)));
            $offset = ($page - 1) * $limit;
            
            $where = [];
            $params = [];
            
            if (!empty($_GET['category']) && $_GET['category'] !== 'All') {
                $where[] = "c.name = ?";
                $params[] = $_GET['category'];
            }
            if (!empty($_GET['status']) && $_GET['status'] !== 'All') {
                $where[] = "n.status = ?";
                $params[] = strtolower($_GET['status']);
            }
            if (!empty($_GET['search'])) {
                $where[] = "(n.title LIKE ? OR n.content LIKE ?)";
                $params[] = '%' . $_GET['search'] . '%';
                $params[] = '%' . $_GET['search'] . '%';
            }
            
            $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';
            
            // Get news
            $sql = "SELECT n.*, c.name as category, GROUP_CONCAT(t.name) as tags 
                    FROM news n 
                    LEFT JOIN categories c ON n.category_id = c.id 
                    LEFT JOIN news_tags nt ON n.id = nt.news_id 
                    LEFT JOIN tags t ON nt.tag_id = t.id 
                    $whereClause 
                    GROUP BY n.id 
                    ORDER BY n.created_at DESC 
                    LIMIT $limit OFFSET $offset";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $news = $stmt->fetchAll();
            
            // Get total count
            $countSql = "SELECT COUNT(*) FROM news n LEFT JOIN categories c ON n.category_id = c.id $whereClause";
            $countStmt = $pdo->prepare($countSql);
            $countStmt->execute($params);
            $total = (int)$countStmt->fetchColumn();
            
            jsonResponse([
                'success' => true,
                'news' => $news,
                'pagination' => ['page' => $page, 'limit' => $limit, 'total' => $total, 'pages' => ceil($total / $limit)]
            ]);
        }
        
        elseif ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            
            $stmt = $pdo->prepare("INSERT INTO news (title, slug, content, short_description, category_id, status, is_breaking, is_trending, is_featured, published_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            
            $publishedAt = ($data['status'] ?? 'draft') === 'published' ? date('Y-m-d H:i:s') : null;
            
            $stmt->execute([
                $data['title'] ?? '',
                $data['slug'] ?? generateSlug($data['title'] ?? ''),
                $data['content'] ?? '',
                $data['shortDescription'] ?? '',
                $data['category'] ?? null,
                $data['status'] ?? 'draft',
                !empty($data['isBreaking']) ? 1 : 0,
                !empty($data['isTrending']) ? 1 : 0,
                !empty($data['isFeatured']) ? 1 : 0,
                $publishedAt
            ]);
            
            jsonResponse(['success' => true, 'id' => $pdo->lastInsertId(), 'message' => 'News created']);
        }
        
        elseif ($method === 'PUT' && $id) {
            $data = json_decode(file_get_contents('php://input'), true);
            
            $stmt = $pdo->prepare("UPDATE news SET title = ?, slug = ?, content = ?, short_description = ?, category_id = ?, status = ?, is_breaking = ?, is_trending = ?, is_featured = ? WHERE id = ?");
            $stmt->execute([
                $data['title'] ?? '',
                $data['slug'] ?? '',
                $data['content'] ?? '',
                $data['shortDescription'] ?? '',
                $data['category'] ?? null,
                $data['status'] ?? 'draft',
                !empty($data['isBreaking']) ? 1 : 0,
                !empty($data['isTrending']) ? 1 : 0,
                !empty($data['isFeatured']) ? 1 : 0,
                $id
            ]);
            
            jsonResponse(['success' => true, 'message' => 'News updated']);
        }
        
        elseif ($method === 'DELETE' && $id) {
            $pdo->prepare("DELETE FROM news_tags WHERE news_id = ?")->execute([$id]);
            $pdo->prepare("DELETE FROM news WHERE id = ?")->execute([$id]);
            jsonResponse(['success' => true, 'message' => 'News deleted']);
        }
        break;

    // ==================== CATEGORIES ====================
    case 'categories':
        authenticateAdmin($pdo);
        
        if ($method === 'GET') {
            $stmt = $pdo->query("SELECT c.*, COUNT(n.id) as news_count FROM categories c LEFT JOIN news n ON c.id = n.category_id GROUP BY c.id ORDER BY c.name");
            jsonResponse(['success' => true, 'categories' => $stmt->fetchAll()]);
        }
        elseif ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $pdo->prepare("INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)");
            $stmt->execute([$data['name'] ?? '', generateSlug($data['name'] ?? ''), $data['description'] ?? '']);
            jsonResponse(['success' => true, 'id' => $pdo->lastInsertId()]);
        }
        elseif ($method === 'PUT' && $id) {
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $pdo->prepare("UPDATE categories SET name = ?, slug = ?, description = ? WHERE id = ?");
            $stmt->execute([$data['name'] ?? '', $data['slug'] ?? '', $data['description'] ?? '', $id]);
            jsonResponse(['success' => true]);
        }
        elseif ($method === 'DELETE' && $id) {
            $pdo->prepare("DELETE FROM categories WHERE id = ?")->execute([$id]);
            jsonResponse(['success' => true]);
        }
        break;

    // ==================== TAGS ====================
    case 'tags':
        authenticateAdmin($pdo);
        
        if ($method === 'GET') {
            $stmt = $pdo->query("SELECT t.*, COUNT(nt.news_id) as news_count FROM tags t LEFT JOIN news_tags nt ON t.id = nt.tag_id GROUP BY t.id ORDER BY t.name");
            jsonResponse(['success' => true, 'tags' => $stmt->fetchAll()]);
        }
        elseif ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $pdo->prepare("INSERT INTO tags (name, slug) VALUES (?, ?)");
            $stmt->execute([$data['name'] ?? '', generateSlug($data['name'] ?? '')]);
            jsonResponse(['success' => true, 'id' => $pdo->lastInsertId()]);
        }
        elseif ($method === 'DELETE' && $id) {
            $pdo->prepare("DELETE FROM news_tags WHERE tag_id = ?")->execute([$id]);
            $pdo->prepare("DELETE FROM tags WHERE id = ?")->execute([$id]);
            jsonResponse(['success' => true]);
        }
        break;

    // ==================== MESSAGES ====================
    case 'messages':
        authenticateAdmin($pdo);
        
        if ($method === 'GET') {
            $stmt = $pdo->query("SELECT * FROM messages ORDER BY created_at DESC");
            jsonResponse(['success' => true, 'messages' => $stmt->fetchAll()]);
        }
        elseif ($method === 'PUT' && $id) {
            $data = json_decode(file_get_contents('php://input'), true);
            $pdo->prepare("UPDATE messages SET status = ? WHERE id = ?")->execute([$data['status'] ?? 'read', $id]);
            jsonResponse(['success' => true]);
        }
        elseif ($method === 'DELETE' && $id) {
            $pdo->prepare("DELETE FROM messages WHERE id = ?")->execute([$id]);
            jsonResponse(['success' => true]);
        }
        break;

    // ==================== PAGES ====================
    case 'pages':
        authenticateAdmin($pdo);
        
        if ($method === 'GET') {
            if (!empty($_GET['slug'])) {
                $stmt = $pdo->prepare("SELECT * FROM pages WHERE slug = ?");
                $stmt->execute([$_GET['slug']]);
                jsonResponse(['success' => true, 'page' => $stmt->fetch()]);
            } else {
                $stmt = $pdo->query("SELECT * FROM pages ORDER BY slug");
                jsonResponse(['success' => true, 'pages' => $stmt->fetchAll()]);
            }
        }
        elseif ($method === 'PUT') {
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $pdo->prepare("UPDATE pages SET title = ?, content = ? WHERE slug = ?");
            $stmt->execute([$data['title'] ?? '', $data['content'] ?? '', $data['slug'] ?? '']);
            jsonResponse(['success' => true]);
        }
        break;

    // ==================== SETTINGS ====================
    case 'settings':
        authenticateAdmin($pdo);
        
        if ($method === 'GET') {
            $stmt = $pdo->query("SELECT * FROM settings");
            $settings = [];
            foreach ($stmt->fetchAll() as $row) {
                $settings[$row['setting_key']] = $row['setting_value'];
            }
            jsonResponse(['success' => true, 'settings' => $settings]);
        }
        elseif ($method === 'PUT') {
            $data = json_decode(file_get_contents('php://input'), true);
            foreach ($data as $key => $value) {
                $stmt = $pdo->prepare("INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?");
                $stmt->execute([$key, $value, $value]);
            }
            jsonResponse(['success' => true]);
        }
        break;

    // ==================== SETUP ====================
    case 'setup':
        if ($method !== 'POST') jsonResponse(['error' => 'Method not allowed'], 405);
        
        if ($pdo->query("SELECT COUNT(*) FROM admin")->fetchColumn() > 0) {
            jsonResponse(['error' => 'Admin already exists'], 400);
        }
        
        $data = json_decode(file_get_contents('php://input'), true);
        $password = $data['password'] ?? 'admin123';
        
        $stmt = $pdo->prepare("INSERT INTO admin (username, email, password_hash, name) VALUES (?, ?, ?, ?)");
        $stmt->execute([
            $data['username'] ?? 'admin',
            $data['email'] ?? 'admin@newsportal.com',
            password_hash($password, PASSWORD_BCRYPT),
            $data['name'] ?? 'Administrator'
        ]);
        
        jsonResponse(['success' => true, 'message' => 'Admin created', 'email' => $data['email'] ?? 'admin@newsportal.com']);
        break;

    default:
        jsonResponse(['error' => 'Action not found'], 404);
}
