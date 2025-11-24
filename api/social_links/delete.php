<?php
// api/social_links/delete.php
header('Content-Type: application/json');
require_once '../config/db.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$stmt = $conn->prepare("DELETE FROM social_links WHERE id = ? AND user_id = ?");
$stmt->execute([$data['id'], $_SESSION['user_id']]);
echo json_encode(['message' => 'Red social eliminada']);
?>