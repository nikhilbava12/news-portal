<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = $segments[1] ?? null;

function getNewsVisuals($pdo, $newsId) {
    $stmt = $pdo->prepare("SELECT visual_url, visual_type FROM news_visual WHERE news_id = ? ORDER BY sort_order");
    $stmt->execute([$newsId]);
    return $stmt->fetchAll();
}

function formatNews($news, $pdo) {
    $news['images'] = getNewsVisuals($pdo, $news['news_id']);
    $news['featured_image'] = $news['images'][0]['visual_url'] ?? null;
    return $news;
}

try {
    switch ($method) {
        case 'GET':
            if ($id) {
                // Get single news with details
                $stmt = $pdo->prepare("
                    SELECT n.*, c.name as category_name,
                           LOWER(REPLACE(REPLACE(TRIM(c.name), ' ', '-'), '/', '-')) as category_slug
                    FROM news n
                    LEFT JOIN categories c ON n.category_id = c.id
                    WHERE n.news_id = ? AND n.status = 'published'
                ");
                $stmt->execute([$id]);
                $news = $stmt->fetch();

                if (!$news) {
                    http_response_code(404);
                    echo json_encode(['error' => 'News not found']);
                    exit;
                }

                // Update view count
                $pdo->prepare("UPDATE news SET total_views = total_views + 1 WHERE news_id = ?")
                    ->execute([$id]);

                // Record daily view
                $pdo->prepare("
                    INSERT INTO daily_views (news_id, view_date, view_count)
                    VALUES (?, CURDATE(), 1)
                    ON DUPLICATE KEY UPDATE view_count = view_count + 1
                ")->execute([$id]);

                echo json_encode(formatNews($news, $pdo));
            } else {
                // List news with pagination
                $page = (int)($_GET['page'] ?? 1);
                $limit = (int)($_GET['limit'] ?? 10);
                $offset = ($page - 1) * $limit;
                $category = $_GET['category'] ?? null;
                $search = $_GET['search'] ?? null;

                $where = ["n.status = 'published'"];
                $params = [];

                if ($category) {
                    $where[] = "LOWER(REPLACE(REPLACE(TRIM(c.name), ' ', '-'), '/', '-')) = ?";
                    $params[] = $category;
                }

                if ($search) {
                    $where[] = "(n.title LIKE ? OR n.main_content LIKE ?)";
                    $params[] = "%$search%";
                    $params[] = "%$search%";
                }

                $whereClause = implode(' AND ', $where);

                // Get total count
                $countStmt = $pdo->prepare("
                    SELECT COUNT(*) as total
                    FROM news n
                    LEFT JOIN categories c ON n.category_id = c.id
                    WHERE $whereClause
                ");
                $countStmt->execute($params);
                $total = (int)($countStmt->fetch()['total'] ?? 0);

                // Get news
                $stmt = $pdo->prepare("
                    SELECT n.*, c.name as category_name,
                           LOWER(REPLACE(REPLACE(TRIM(c.name), ' ', '-'), '/', '-')) as category_slug
                    FROM news n
                    LEFT JOIN categories c ON n.category_id = c.id
                    WHERE $whereClause
                    ORDER BY n.created_at DESC
                    LIMIT ? OFFSET ?
                ");
                $stmt->execute(array_merge($params, [$limit, $offset]));
                $newsList = $stmt->fetchAll();

                $formattedNews = array_map(function ($news) use ($pdo) {
                    return formatNews($news, $pdo);
                }, $newsList);

                echo json_encode([
                    'data' => $formattedNews,
                    'pagination' => [
                        'page' => $page,
                        'limit' => $limit,
                        'total' => $total,
                        'totalPages' => (int)ceil($total / max(1, $limit))
                    ]
                ]);
            }
            break;

        case 'POST':
            // Admin: Create news
            $data = json_decode(file_get_contents('php://input'), true);

            $stmt = $pdo->prepare("
                INSERT INTO news (category_id, title, main_content, status, schedule_at, is_featured, is_breaking)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $data['category_id'],
                $data['title'],
                $data['main_content'],
                $data['status'] ?? 'draft',
                $data['schedule_at'] ?? null,
                $data['is_featured'] ?? false,
                $data['is_breaking'] ?? false
            ]);

            $newsId = $pdo->lastInsertId();

            // Insert visuals
            if (!empty($data['images'])) {
                $visualStmt = $pdo->prepare("
                    INSERT INTO news_visual (news_id, visual_url, visual_type, sort_order)
                    VALUES (?, ?, ?, ?)
                ");
                foreach ($data['images'] as $index => $image) {
                    $visualStmt->execute([
                        $newsId,
                        $image['url'],
                        $image['type'] ?? 'image',
                        $index
                    ]);
                }
            }

            echo json_encode(['news_id' => $newsId, 'message' => 'News created']);
            break;
        
        case 'PUT':
            // Admin: Update news
            if (!$id) {
                http_response_code(400);
                echo json_encode(['error' => 'News ID required']);
                exit;
            }

            $data = json_decode(file_get_contents('php://input'), true);

            $stmt = $pdo->prepare("
                UPDATE news SET 
                    category_id = ?,
                    title = ?,
                    main_content = ?,
                    status = ?,
                    schedule_at = ?,
                    is_featured = ?,
                    is_breaking = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE news_id = ?
            ");
            $stmt->execute([
                $data['category_id'],
                $data['title'],
                $data['main_content'],
                $data['status'],
                $data['schedule_at'] ?? null,
                $data['is_featured'] ?? false,
                $data['is_breaking'] ?? false,
                $id
            ]);

            // Update visuals if provided
            if (!empty($data['images'])) {
                $pdo->prepare("DELETE FROM news_visual WHERE news_id = ?")->execute([$id]);

                $visualStmt = $pdo->prepare("
                    INSERT INTO news_visual (news_id, visual_url, visual_type, sort_order)
                    VALUES (?, ?, ?, ?)
                ");
                foreach ($data['images'] as $index => $image) {
                    $visualStmt->execute([$id, $image['url'], $image['type'] ?? 'image', $index]);
                }
            }

            echo json_encode(['message' => 'News updated']);
            break;
        
        case 'DELETE':
            // Admin: Delete news
            if (!$id) {
                http_response_code(400);
                echo json_encode(['error' => 'News ID required']);
                exit;
            }

            $pdo->prepare("DELETE FROM news WHERE news_id = ?")->execute([$id]);
            echo json_encode(['message' => 'News deleted']);
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
