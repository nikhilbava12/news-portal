<?php
/**
 * Index.php Debug Script
 * Tests API routing through index.php including admin endpoints via query params
 * 
 * Usage:
 * - Browser: http://localhost/news/news-portal/api/index-debug.php
 * - CLI: php api/index-debug.php
 */

$BASE_URL = 'http://localhost/news/news-portal/api/index.php';
$ADMIN_EMAIL = 'admin@newsportal.com';
$ADMIN_PASSWORD = 'admin123';

function isCLI() {
    return php_sapi_name() === 'cli' || !isset($_SERVER['REQUEST_METHOD']);
}

function h($v) {
    return htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8');
}

function logMsg($message, $type = 'info') {
    $GREEN = "\033[32m";
    $RED = "\033[31m";
    $YELLOW = "\033[33m";
    $BLUE = "\033[34m";
    $RESET = "\033[0m";

    if (isCLI()) {
        $color = $type === 'success' ? $GREEN : ($type === 'error' ? $RED : ($type === 'info' ? $BLUE : $YELLOW));
        echo $color . $message . $RESET . PHP_EOL;
    } else {
        $colors = ['success' => 'green', 'error' => 'red', 'info' => 'blue', 'warn' => 'orange'];
        $c = $colors[$type] ?? 'black';
        echo "<div style='color:$c;margin:2px 0'>" . h($message) . "</div>";
    }
}

function pretty($data) {
    if (is_string($data)) return $data;
    return json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
}

function safeJson($raw) {
    if (!is_string($raw) || trim($raw) === '') return null;
    $decoded = json_decode($raw, true);
    if (json_last_error() !== JSON_ERROR_NONE) return null;
    return $decoded;
}

function makeRequest($url, $method = 'GET', $data = null, $token = null) {
    $ch = curl_init();
    
    $reqHeaders = ['Content-Type: application/json'];
    if ($token) $reqHeaders[] = "Authorization: Bearer $token";
    
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $reqHeaders);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    
    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        if ($data !== null) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    } elseif ($method === 'PUT' || $method === 'DELETE') {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        if ($data !== null) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    
    $raw = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);
    
    return [
        'code' => $code,
        'raw' => $raw,
        'json' => safeJson($raw),
        'curl_error' => $err,
    ];
}

function testEndpoint($name, $url, $method = 'GET', $data = null, $token = null) {
    logMsg("\n=== $name ===", 'info');
    logMsg("URL: $url", 'info');
    logMsg("Method: $method", 'info');
    
    if ($data !== null) {
        logMsg("Data: " . pretty($data), 'info');
    }
    
    $res = makeRequest($url, $method, $data, $token);
    
    $ok = ($res['code'] >= 200 && $res['code'] < 300);
    logMsg("HTTP Code: " . $res['code'], $ok ? 'success' : 'error');
    
    if ($res['curl_error']) {
        logMsg("CURL Error: " . $res['curl_error'], 'error');
    }
    
    if ($res['json'] !== null) {
        logMsg("Response: " . pretty($res['json']), $ok ? 'success' : 'error');
    } else {
        logMsg("Raw: " . $res['raw'], 'error');
    }
    
    return $res;
}

// HTML Header
if (!isCLI()) {
    echo "<!DOCTYPE html><html><head><title>Index.php Debug</title></head>";
    echo "<body style='font-family:monospace;padding:20px;background:#f5f5f5'>";
    echo "<div style='max-width:900px;margin:0 auto;background:#fff;padding:20px;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1)'>";
    echo "<h1 style='color:#333;border-bottom:2px solid #e74c3c;padding-bottom:10px'>Index.php Debug Script</h1>";
    echo "<pre style='white-space:pre-wrap'>";
}

logMsg("========================================", 'info');
logMsg("INDEX.PHP ROUTING DEBUG", 'info');
logMsg("========================================", 'info');
logMsg("Base: $BASE_URL", 'info');
logMsg("Time: " . date('Y-m-d H:i:s'), 'info');

$token = null;

// Test 1: Basic API check
testEndpoint("Basic API Check", $BASE_URL, "GET");

// Test 2: Public endpoints
testEndpoint("Public Categories", "$BASE_URL/categories", "GET");
testEndpoint("Public Breaking News", "$BASE_URL/breaking", "GET");

// Test 3: Admin Setup via query param
testEndpoint("Admin Setup (query param)", "$BASE_URL?admin=setup", "POST");

// Test 4: Admin Login via query param
$login = testEndpoint(
    "Admin Login (query param)",
    "$BASE_URL?admin=login",
    "POST",
    ['email' => $ADMIN_EMAIL, 'password' => $ADMIN_PASSWORD]
);

if (isset($login['json']['token'])) {
    $token = $login['json']['token'];
    logMsg("✓ Token: " . substr($token, 0, 25) . "...", 'success');
} else {
    logMsg("✗ Login failed - stopping admin tests", 'error');
    if (!isCLI()) echo "</pre></div></body></html>";
    exit;
}

// Test 5: Admin endpoints via query params
logMsg("\n========================================", 'info');
logMsg("ADMIN ENDPOINTS VIA QUERY PARAMS", 'info');
logMsg("========================================", 'info');

testEndpoint("Stats", "$BASE_URL?admin=stats", "GET", null, $token);
testEndpoint("Categories List", "$BASE_URL?admin=categories", "GET", null, $token);
testEndpoint("Tags List", "$BASE_URL?admin=tags", "GET", null, $token);
testEndpoint("News List", "$BASE_URL?admin=news", "GET", null, $token);
testEndpoint("Messages List", "$BASE_URL?admin=messages", "GET", null, $token);
testEndpoint("Pages List", "$BASE_URL?admin=pages", "GET", null, $token);
testEndpoint("Settings", "$BASE_URL?admin=settings", "GET", null, $token);

// Test 6: Admin endpoints via path (traditional)
logMsg("\n========================================", 'info');
logMsg("ADMIN ENDPOINTS VIA PATH", 'info');
logMsg("========================================", 'info');

testEndpoint("Stats (path)", "$BASE_URL/admin/stats", "GET", null, $token);
testEndpoint("Categories (path)", "$BASE_URL/admin/categories", "GET", null, $token);

// Test 7: Create operations
logMsg("\n========================================", 'info');
logMsg("CREATE OPERATIONS", 'info');
logMsg("========================================", 'info');

$cat = testEndpoint(
    "Create Category",
    "$BASE_URL?admin=categories",
    "POST",
    ['name' => 'TestCat' . time(), 'slug' => 'test-cat-' . time()],
    $token
);
$catId = $cat['json']['id'] ?? null;

$tag = testEndpoint(
    "Create Tag",
    "$BASE_URL?admin=tags",
    "POST",
    ['name' => 'TestTag' . time()],
    $token
);
$tagId = $tag['json']['id'] ?? null;

// Test 8: Get by ID
if ($catId) {
    logMsg("\n========================================", 'info');
    logMsg("GET BY ID", 'info');
    logMsg("========================================", 'info');
    
    testEndpoint("Get Category #$catId", "$BASE_URL?admin=categories&id=$catId", "GET", null, $token);
}

// Test 9: Update
if ($catId) {
    logMsg("\n========================================", 'info');
    logMsg("UPDATE", 'info');
    logMsg("========================================", 'info');
    
    testEndpoint(
        "Update Category #$catId",
        "$BASE_URL?admin=categories&id=$catId",
        "PUT",
        ['name' => 'UpdatedCat' . time(), 'slug' => 'updated-cat-' . time()],
        $token
    );
}

// Test 10: Delete (cleanup)
logMsg("\n========================================", 'info');
logMsg("CLEANUP (DELETE)", 'info');
logMsg("========================================", 'info');

if ($catId) {
    testEndpoint("Delete Category #$catId", "$BASE_URL?admin=categories&id=$catId", "DELETE", null, $token);
}
if ($tagId) {
    testEndpoint("Delete Tag #$tagId", "$BASE_URL?admin=tags&id=$tagId", "DELETE", null, $token);
}

logMsg("\n========================================", 'info');
logMsg("DEBUG COMPLETE", 'info');
logMsg("========================================", 'info');

if (!isCLI()) {
    echo "</pre></div></body></html>";
}
