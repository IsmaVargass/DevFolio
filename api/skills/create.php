<?php
// api/skills/create.php
header('Content-Type: application/json');
require_once '../config/db.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$user_id = $_SESSION['user_id'];
$name = $data['name'];
$level = $data['level'];

try {
    $stmt = $conn->prepare("INSERT INTO skills (user_id, name, level) VALUES (?, ?, ?)");
    $stmt->execute([$user_id, $name, $level]);
    echo json_encode(['message' => 'Skill creada', 'id' => $conn->lastInsertId()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>