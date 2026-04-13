<?php
require_once __DIR__ . '/config.php';
setCorsHeaders();
initDB();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || empty($input['type'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request']);
    exit;
}

$pdo = getDB();

// --- PAGE VIEW ---
if ($input['type'] === 'pageview') {
    $stmt = $pdo->prepare("
        INSERT INTO visits (visitor_id, page, page_title, referrer, user_agent, screen_width, screen_height, language, ip_address)
        VALUES (:visitor_id, :page, :page_title, :referrer, :user_agent, :screen_width, :screen_height, :language, :ip_address)
    ");

    $stmt->execute([
        ':visitor_id'   => substr($input['visitorId'] ?? '', 0, 64),
        ':page'         => substr($input['page'] ?? '', 0, 255),
        ':page_title'   => substr($input['pageTitle'] ?? '', 0, 255),
        ':referrer'     => substr($input['referrer'] ?? '', 0, 512),
        ':user_agent'   => substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 512),
        ':screen_width' => intval($input['screenWidth'] ?? 0),
        ':screen_height'=> intval($input['screenHeight'] ?? 0),
        ':language'     => substr($input['language'] ?? '', 0, 16),
        ':ip_address'   => substr($_SERVER['REMOTE_ADDR'] ?? '', 0, 45)
    ]);

    echo json_encode(['ok' => true]);
    exit;
}

// --- HEARTBEAT ---
if ($input['type'] === 'heartbeat') {
    $visitorId = substr($input['visitorId'] ?? '', 0, 64);
    $page = substr($input['page'] ?? '', 0, 255);

    if (empty($visitorId)) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing visitorId']);
        exit;
    }

    $stmt = $pdo->prepare("
        INSERT INTO heartbeats (visitor_id, last_seen, current_page)
        VALUES (:vid, NOW(), :page)
        ON DUPLICATE KEY UPDATE last_seen = NOW(), current_page = :page2
    ");

    $stmt->execute([
        ':vid'   => $visitorId,
        ':page'  => $page,
        ':page2' => $page
    ]);

    echo json_encode(['ok' => true]);
    exit;
}

http_response_code(400);
echo json_encode(['error' => 'Unknown type']);
