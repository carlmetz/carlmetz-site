<?php
require_once __DIR__ . '/config.php';
setCorsHeaders();
initDB();

session_start();

if (empty($_SESSION['admin_auth'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Non autorise']);
    exit;
}

$pdo = getDB();
$period = $_GET['period'] ?? '7d';

// Déterminer l'intervalle
switch ($period) {
    case '24h': $interval = '1 DAY'; break;
    case '30d': $interval = '30 DAY'; break;
    default:    $interval = '7 DAY'; break;
}

// --- KPIs ---

// Utilisateurs actifs maintenant (heartbeat < 60s)
$stmt = $pdo->query("SELECT COUNT(DISTINCT visitor_id) as count FROM heartbeats WHERE last_seen > DATE_SUB(NOW(), INTERVAL 60 SECOND)");
$activeNow = (int) $stmt->fetchColumn();

// Visiteurs uniques 24h
$stmt = $pdo->query("SELECT COUNT(DISTINCT visitor_id) as count FROM visits WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 DAY)");
$visitors24h = (int) $stmt->fetchColumn();

// Visiteurs uniques 7j
$stmt = $pdo->query("SELECT COUNT(DISTINCT visitor_id) as count FROM visits WHERE created_at > DATE_SUB(NOW(), INTERVAL 7 DAY)");
$visitors7d = (int) $stmt->fetchColumn();

// Visiteurs uniques 30j
$stmt = $pdo->query("SELECT COUNT(DISTINCT visitor_id) as count FROM visits WHERE created_at > DATE_SUB(NOW(), INTERVAL 30 DAY)");
$visitors30d = (int) $stmt->fetchColumn();

// --- TOP 5 PAGES (filtrées par période) ---
$stmt = $pdo->prepare("
    SELECT page, COUNT(*) as views
    FROM visits
    WHERE created_at > DATE_SUB(NOW(), INTERVAL $interval)
    GROUP BY page
    ORDER BY views DESC
    LIMIT 5
");
$stmt->execute();
$topPages = $stmt->fetchAll();

// --- DERNIÈRES SESSIONS (50 dernières) ---
$stmt = $pdo->query("
    SELECT visitor_id, page, page_title, referrer, user_agent, screen_width, screen_height, language, ip_address, created_at
    FROM visits
    ORDER BY created_at DESC
    LIMIT 50
");
$sessions = $stmt->fetchAll();

// --- RÉPONSE ---
echo json_encode([
    'kpis' => [
        'activeNow'   => $activeNow,
        'visitors24h' => $visitors24h,
        'visitors7d'  => $visitors7d,
        'visitors30d' => $visitors30d
    ],
    'topPages' => $topPages,
    'sessions' => $sessions,
    'period'   => $period
]);
