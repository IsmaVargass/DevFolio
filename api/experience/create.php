<?php
// api/experience/create.php
header('Content-Type: application/json');
require_once '../config/db.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$user_id = $_SESSION['user_id'];

try {
    $stmt = $conn->prepare("INSERT INTO experience (user_id, company, position, start_date, end_date, description) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $user_id,
        $data['company'],
        $data['position'],
        $data['start_date'],
        $data['end_date'] ?? null,
        $data['description']
    ]);
    echo json_encode(['message' => 'Experiencia creada', 'id' => $conn->lastInsertId()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>