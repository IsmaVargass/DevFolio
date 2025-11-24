<?php
// api/education/list.php
header('Content-Type: application/json');
require_once '../config/db.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM education WHERE user_id = ? ORDER BY start_date DESC");
$stmt->execute([$_SESSION['user_id']]);
echo json_encode($stmt->fetchAll());
?>