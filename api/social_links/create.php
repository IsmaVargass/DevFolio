<?php
// api/social_links/create.php
header('Content-Type: application/json');
require_once '../config/db.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

try {
    $stmt = $conn->prepare("INSERT INTO social_links (user_id, platform, url) VALUES (?, ?, ?)");
    $stmt->execute([
        $_SESSION['user_id'],
        $data['platform'],
        $data['url']
    ]);
    echo json_encode(['message' => 'Red social creada', 'id' => $conn->lastInsertId()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>