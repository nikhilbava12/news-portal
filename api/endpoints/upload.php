<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Create uploads directory if not exists
$uploadDir = __DIR__ . '/../../uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Check if file was uploaded
if (!isset($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(['error' => 'No file uploaded']);
    exit;
}

$file = $_FILES['file'];
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4'];
$maxSize = 10 * 1024 * 1024; // 10MB

// Validate file
if (!in_array($file['type'], $allowedTypes)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid file type. Allowed: JPG, PNG, GIF, WebP, MP4']);
    exit;
}

if ($file['size'] > $maxSize) {
    http_response_code(400);
    echo json_encode(['error' => 'File too large. Max size: 10MB']);
    exit;
}

// Generate unique filename
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = uniqid() . '_' . time() . '.' . $extension;
$filepath = $uploadDir . $filename;

// Move file
if (move_uploaded_file($file['tmp_name'], $filepath)) {
    // Return URL
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'];
    $url = "$protocol://$host/news-portal/uploads/$filename";
    
    echo json_encode([
        'success' => true,
        'url' => $url,
        'filename' => $filename,
        'type' => strpos($file['type'], 'video') !== false ? 'video' : 'image'
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to upload file']);
}
