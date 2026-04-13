<?php
require_once __DIR__ . '/config.php';
setCorsHeaders();

session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$password = $input['password'] ?? '';

if ($password === ADMIN_PASSWORD) {
    $_SESSION['admin_auth'] = true;
    echo json_encode(['ok' => true]);
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Mot de passe incorrect']);
}
