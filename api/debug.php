<?php
/**
 * Admin Backend API Debugger (Remade)
 * - Shows environment info
 * - Shows request + response headers
 * - Prints raw body when JSON fails
 * - Includes DB table check (reads api/db.php directly)
 *
 * Run:
 * - Browser: http://localhost/news/news-portal/api/debug.php
 * - CLI: php api/debug.php
 */

// ===================== CONFIG =====================
$BASE_URL = 'http://localhost/news/news-portal/api/index.php';
$ADMIN_EMAIL = 'admin@newsportal.com';
$ADMIN_PASSWORD = 'admin123';

$TIMEOUT_SECONDS = 25;
$SHOW_RESPONSE_HEADERS = true;

// ===================== UTIL =====================
function isCLI() {
    return php_sapi_name() === 'cli' || !isset($_SERVER['REQUEST_METHOD']);
}
function h($v) {
    return htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8');
}
function out($msg) {
    if (isCLI()) echo $msg . PHP_EOL;
    else echo $msg;
}
function logMsg($message, $type = 'info') {
    $GREEN = "\033[32m";
    $RED = "\033[31m";
    $YELLOW = "\033[33m";
    $RESET = "\033[0m";

    if (isCLI()) {
        $color = $type === 'success' ? $GREEN : ($type === 'error' ? $RED : $YELLOW);
        echo $color . $message . $RESET . PHP_EOL;
    } else {
        $color = $type === 'success' ? 'green' : ($type === 'error' ? 'red' : 'orange');
        echo "<div style='color:$color'>" . h($message) . "</div>";
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

// ===================== DB CHECK (DIRECT) =====================
function dbCheck() {
    $dbFile = __DIR__ . '/db.php';
    if (!file_exists($dbFile)) {
        return ['ok' => false, 'error' => 'api/db.php not found'];
    }

    try {
        require $dbFile; // should set $pdo
        if (!isset($pdo)) return ['ok' => false, 'error' => 'PDO not available after require db.php'];

        $dbName = $pdo->query('SELECT DATABASE()')->fetchColumn();

        $required = ['admin','categories','tags','news','news_tags','messages','pages','settings'];
        $existing = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN) ?: [];
        $missing = array_values(array_diff($required, $existing));

        return [
            'ok' => true,
            'database' => $dbName,
            'existing_tables' => $existing,
            'missing_tables' => $missing,
        ];
    } catch (Throwable $e) {
        return [
            'ok' => false,
            'error' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
        ];
    }
}

// ===================== HTTP =====================
function makeRequest($url, $method = 'GET', $data = null, $token = null) {
    global $TIMEOUT_SECONDS, $SHOW_RESPONSE_HEADERS;

    $ch = curl_init();

    $reqHeaders = ['Content-Type: application/json'];
    if ($token) $reqHeaders[] = "Authorization: Bearer $token";

    $respHeaders = [];
    curl_setopt($ch, CURLOPT_HEADERFUNCTION, function ($curl, $header) use (&$respHeaders) {
        $len = strlen($header);
        $header = trim($header);
        if ($header === '' || strpos($header, ':') === false) return $len;
        [$k, $v] = explode(':', $header, 2);
        $k = trim($k);
        $v = trim($v);
        if (!isset($respHeaders[$k])) $respHeaders[$k] = $v;
        else {
            if (is_array($respHeaders[$k])) $respHeaders[$k][] = $v;
            else $respHeaders[$k] = [$respHeaders[$k], $v];
        }
        return $len;
    });

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $reqHeaders);
    curl_setopt($ch, CURLOPT_TIMEOUT, $TIMEOUT_SECONDS);

    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        if ($data !== null) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    } elseif ($method === 'PUT' || $method === 'DELETE' || $method === 'PATCH') {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        if ($data !== null) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }

    $raw = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);

    curl_close($ch);

    return [
        'code' => $code,
        'req_headers' => $reqHeaders,
        'resp_headers' => $SHOW_RESPONSE_HEADERS ? $respHeaders : null,
        'raw' => $raw,
        'json' => safeJson($raw),
        'curl_error' => $err,
    ];
}

function testEndpoint($name, $url, $method = 'GET', $data = null, $token = null) {
    logMsg("\n--- Testing: $name ---", 'info');
    logMsg("URL: $url", 'info');
    logMsg("Method: $method", 'info');
    if ($data !== null) logMsg("Data: " . pretty($data), 'info');

    $res = makeRequest($url, $method, $data, $token);

    $ok = ($res['code'] >= 200 && $res['code'] < 300);
    logMsg("HTTP Code: " . $res['code'], $ok ? 'success' : 'error');

    if ($res['curl_error']) logMsg("CURL Error: " . $res['curl_error'], 'error');

    if ($res['resp_headers'] !== null) {
        logMsg("Response Headers: " . pretty($res['resp_headers']), $ok ? 'success' : 'info');
    }

    if ($res['json'] !== null) {
        logMsg("JSON Response: " . pretty($res['json']), $ok ? 'success' : 'error');
    } else {
        logMsg("Raw Response: " . (is_string($res['raw']) ? $res['raw'] : ''), $ok ? 'success' : 'error');
    }

    return $res;
}

// ===================== UI WRAP =====================
if (!isCLI()) {
    echo "<!doctype html><html><head><meta charset='utf-8'><title>Admin API Debugger</title></head>";
    echo "<body style='font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; padding:16px'>";
    echo "<h2>Admin Backend API Debugger</h2><pre style='white-space:pre-wrap'>";
}

// ===================== START =====================
logMsg("========================================", 'info');
logMsg("ADMIN BACKEND API DEBUGGER (REMADE)", 'info');
logMsg("========================================", 'info');
logMsg("Base URL: $BASE_URL", 'info');
logMsg("Time: " . date('Y-m-d H:i:s'), 'info');
logMsg("PHP: " . PHP_VERSION . " | SAPI: " . php_sapi_name(), 'info');

if (!isCLI()) {
    logMsg("Server: " . ($_SERVER['SERVER_SOFTWARE'] ?? 'N/A'), 'info');
}

logMsg("\n--- Local DB Check (api/db.php) ---", 'info');
$db = dbCheck();
if (!($db['ok'] ?? false)) {
    logMsg("DB Check FAILED: " . pretty($db), 'error');
} else {
    logMsg("Database: " . ($db['database'] ?? 'N/A'), 'success');
    $missing = $db['missing_tables'] ?? [];
    if (count($missing) > 0) {
        logMsg("Missing tables: " . implode(', ', $missing), 'error');
        logMsg("Import api/database/schema.sql into DB: news_portal", 'error');
    } else {
        logMsg("All required tables exist.", 'success');
    }
}

$token = null;

// Setup (may say admin exists)
testEndpoint("Setup (Create Admin User)", "$BASE_URL/admin/setup", "POST");

// Login
$login = testEndpoint(
    "Login",
    "$BASE_URL/admin/login",
    "POST",
    ['email' => $ADMIN_EMAIL, 'password' => $ADMIN_PASSWORD]
);

if (isset($login['json']['token'])) {
    $token = $login['json']['token'];
    logMsg("Token received: " . substr($token, 0, 20) . "...", 'success');
} else {
    logMsg("Login failed - stopping.", 'error');
    if (!isCLI()) echo "</pre></body></html>";
    exit;
}

// Auth tests
testEndpoint("Dashboard Stats", "$BASE_URL/admin/stats", "GET", null, $token);
testEndpoint("Categories - Get All", "$BASE_URL/admin/categories", "GET", null, $token);
testEndpoint("Tags - Get All", "$BASE_URL/admin/tags", "GET", null, $token);
testEndpoint("News - Get All", "$BASE_URL/admin/news", "GET", null, $token);
testEndpoint("Messages - Get All", "$BASE_URL/admin/messages", "GET", null, $token);
testEndpoint("Pages - Get All", "$BASE_URL/admin/pages", "GET", null, $token);
testEndpoint("Settings - Get", "$BASE_URL/admin/settings", "GET", null, $token);

logMsg("\n========================================", 'info');
logMsg("DEBUG COMPLETE", 'info');
logMsg("========================================", 'info');

if (!isCLI()) {
    echo "</pre></body></html>";
}