<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';

try {
    // Get featured news (main hero article)
    $stmt = $pdo->query("
        SELECT n.*, c.name as category_name,
               LOWER(REPLACE(REPLACE(TRIM(c.name), ' ', '-'), '/', '-')) as category_slug
        FROM news n
        LEFT JOIN categories c ON n.category_id = c.id
        WHERE n.is_featured = TRUE AND n.status = 'published'
        ORDER BY n.updated_at DESC
        LIMIT 1
    ");
    $news = $stmt->fetch();

    if ($news) {
        $visualStmt = $pdo->prepare("SELECT visual_url FROM news_visual WHERE news_id = ? ORDER BY sort_order");
        $visualStmt->execute([$news['news_id']]);
        $news['images'] = $visualStmt->fetchAll(PDO::FETCH_COLUMN);
        $news['featured_image'] = $news['images'][0] ?? null;
    }

    echo json_encode($news);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
