<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';

try {
    // Get popular news (all-time highest views)
    $stmt = $pdo->query("
        SELECT n.*, c.name as category_name,
               LOWER(REPLACE(REPLACE(TRIM(c.name), ' ', '-'), '/', '-')) as category_slug
        FROM news n
        LEFT JOIN categories c ON n.category_id = c.id
        WHERE n.is_popular = TRUE AND n.status = 'published'
        ORDER BY n.total_views DESC, n.created_at DESC
        LIMIT 10
    ");
    $newsList = $stmt->fetchAll();

    // Add images to each news
    foreach ($newsList as &$news) {
        $visualStmt = $pdo->prepare("SELECT visual_url FROM news_visual WHERE news_id = ? ORDER BY sort_order LIMIT 1");
        $visualStmt->execute([$news['news_id']]);
        $visual = $visualStmt->fetch();
        $news['featured_image'] = $visual['visual_url'] ?? null;
    }

    echo json_encode($newsList);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
