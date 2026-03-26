<?php
// Admin API Endpoints - Complete Backend for Admin Panel
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $segments[1] ?? '';
$id = $segments[2] ?? $_GET['id'] ?? null;

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
                'name' => $admin['username'],
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
        $totalViews = (int)($pdo->query("SELECT SUM(total_views) FROM news")->fetchColumn() ?? 0);
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
        
        // GET single news by ID
        if ($method === 'GET' && $id) {
            $stmt = $pdo->prepare("SELECT n.news_id as id, n.title, n.category_id, n.status, n.total_views as views, 
                    n.is_breaking, n.is_trending, n.is_popular, n.is_featured, n.schedule_at, n.trending_score, 
                    n.created_at, n.main_content as content,
                    c.name as category, GROUP_CONCAT(t.name) as tags 
                    FROM news n 
                    LEFT JOIN categories c ON n.category_id = c.id 
                    LEFT JOIN news_tags nt ON n.news_id = nt.news_id 
                    LEFT JOIN tags t ON nt.tag_id = t.id 
                    WHERE n.news_id = ?
                    GROUP BY n.news_id");
            $stmt->execute([$id]);
            $news = $stmt->fetch();
            
            if (!$news) {
                jsonResponse(['error' => 'News not found'], 404);
            }
            
            // Fetch images
            $imgStmt = $pdo->prepare("SELECT visual_url FROM news_visual WHERE news_id = ? ORDER BY sort_order");
            $imgStmt->execute([$id]);
            $news['images'] = $imgStmt->fetchAll(PDO::FETCH_COLUMN);

            // Fallback: if category join failed, resolve name from category_id
            if ((!isset($news['category']) || $news['category'] === null || $news['category'] === '') && !empty($news['category_id'])) {
                $catStmt = $pdo->prepare("SELECT name FROM categories WHERE id = ?");
                $catStmt->execute([$news['category_id']]);
                $catName = $catStmt->fetchColumn();
                if ($catName) {
                    $news['category'] = $catName;
                }
            }
            
            jsonResponse(['success' => true, 'news' => $news]);
        }
        
        // GET list of news
        elseif ($method === 'GET') {
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
                $where[] = "(n.title LIKE ? OR n.main_content LIKE ?)";
                $params[] = '%' . $_GET['search'] . '%';
                $params[] = '%' . $_GET['search'] . '%';
            }
            
            $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';
            
            // Get news
            $sql = "SELECT n.news_id as id, n.title, n.category_id, n.status, n.total_views as views, 
                    n.is_breaking, n.is_trending, n.is_popular, n.is_featured, n.schedule_at, n.trending_score, 
                    n.created_at, 
                    c.name as category, GROUP_CONCAT(t.name) as tags 
                    FROM news n 
                    LEFT JOIN categories c ON n.category_id = c.id 
                    LEFT JOIN news_tags nt ON n.news_id = nt.news_id 
                    LEFT JOIN tags t ON nt.tag_id = t.id 
                    $whereClause 
                    GROUP BY n.news_id 
                    ORDER BY n.created_at DESC 
                    LIMIT $limit OFFSET $offset";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $news = $stmt->fetchAll();
            
            // Get total count
            $countSql = "SELECT COUNT(*) FROM news n $whereClause";
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
            
            // Convert category name to category_id
            $categoryId = null;
            if (!empty($data['category'])) {
                $stmt = $pdo->prepare("SELECT id FROM categories WHERE name = ?");
                $stmt->execute([$data['category']]);
                $category = $stmt->fetch();
                $categoryId = $category ? $category['id'] : null;
            }
            
            $stmt = $pdo->prepare("INSERT INTO news (title, main_content, category_id, status, schedule_at, trending_score, is_breaking, is_trending, is_popular, is_featured, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())");
            
            $stmt->execute([
                $data['title'] ?? '',
                $data['content'] ?? '',
                $categoryId,
                $data['status'] ?? 'draft',
                $data['schedule_at'] ?? null,
                $data['trending_score'] ?? 0,
                !empty($data['isBreaking']) ? 1 : 0,
                !empty($data['isTrending']) ? 1 : 0,
                !empty($data['isPopular']) ? 1 : 0,
                !empty($data['isFeatured']) ? 1 : 0
            ]);
            
            $newsId = $pdo->lastInsertId();
            
            // Insert images into news_visual table
            if (!empty($data['images']) && is_array($data['images'])) {
                $imgStmt = $pdo->prepare("INSERT INTO news_visual (news_id, visual_url, visual_type, sort_order) VALUES (?, ?, 'image', ?)");
                foreach ($data['images'] as $index => $imageUrl) {
                    $imgStmt->execute([$newsId, $imageUrl, $index]);
                }
            }
            
            jsonResponse(['success' => true, 'id' => $newsId, 'message' => 'News created']);
        }
        
        elseif ($method === 'PUT' && $id) {
            $data = json_decode(file_get_contents('php://input'), true);

            // Convert category name to category_id if needed
            $categoryId = null;
            if (isset($data['category']) && $data['category'] !== '' && $data['category'] !== null) {
                if (is_numeric($data['category'])) {
                    $categoryId = (int)$data['category'];
                } else {
                    $catStmt = $pdo->prepare("SELECT id FROM categories WHERE name = ?");
                    $catStmt->execute([$data['category']]);
                    $categoryRow = $catStmt->fetch();
                    $categoryId = $categoryRow ? (int)$categoryRow['id'] : null;
                }
            }
            
            $stmt = $pdo->prepare("UPDATE news SET title = ?, main_content = ?, category_id = ?, status = ?, schedule_at = ?, trending_score = ?, is_breaking = ?, is_trending = ?, is_popular = ?, is_featured = ? WHERE news_id = ?");
            $stmt->execute([
                $data['title'] ?? '',
                $data['content'] ?? '',
                $categoryId,
                $data['status'] ?? 'draft',
                $data['schedule_at'] ?? null,
                $data['trending_score'] ?? 0,
                !empty($data['isBreaking']) ? 1 : 0,
                !empty($data['isTrending']) ? 1 : 0,
                !empty($data['isPopular']) ? 1 : 0,
                !empty($data['isFeatured']) ? 1 : 0,
                $id
            ]);
            
            // Update images - delete old and insert new
            if (!empty($data['images']) && is_array($data['images'])) {
                $pdo->prepare("DELETE FROM news_visual WHERE news_id = ?")->execute([$id]);
                $imgStmt = $pdo->prepare("INSERT INTO news_visual (news_id, visual_url, visual_type, sort_order) VALUES (?, ?, 'image', ?)");
                foreach ($data['images'] as $index => $imageUrl) {
                    $imgStmt->execute([$id, $imageUrl, $index]);
                }
            }
            
            jsonResponse(['success' => true, 'message' => 'News updated']);
        }
        
        elseif ($method === 'DELETE' && $id) {
            $pdo->prepare("DELETE FROM news_tags WHERE news_id = ?")->execute([$id]);
            $pdo->prepare("DELETE FROM news WHERE news_id = ?")->execute([$id]);
            jsonResponse(['success' => true, 'message' => 'News deleted']);
        }
        break;

    // ==================== CATEGORIES ====================
    case 'categories':
        authenticateAdmin($pdo);
        
        if ($method === 'GET') {
            $stmt = $pdo->query("SELECT c.*, COUNT(n.news_id) as news_count FROM categories c LEFT JOIN news n ON c.id = n.category_id GROUP BY c.id ORDER BY c.name");
            jsonResponse(['success' => true, 'categories' => $stmt->fetchAll()]);
        }
        elseif ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $pdo->prepare("INSERT INTO categories (name, description, status) VALUES (?, ?, 'active')");
            $stmt->execute([$data['name'] ?? '', $data['description'] ?? '']);
            jsonResponse(['success' => true, 'id' => $pdo->lastInsertId()]);
        }
        elseif ($method === 'PUT' && $id) {
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $pdo->prepare("UPDATE categories SET name = ?, description = ? WHERE id = ?");
            $stmt->execute([$data['name'] ?? '', $data['description'] ?? '', $id]);
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
