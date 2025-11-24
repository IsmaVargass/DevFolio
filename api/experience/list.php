<?php
// api/experience/list.php
header('Content-Type: application/json');
require_once '../config/db.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    exit;
}

$user_id = $_SESSION['user_id'];
$stmt = $conn->prepare("SELECT * FROM experience WHERE user_id = ? ORDER BY start_date DESC");
$stmt->execute([$user_id]);
echo json_encode($stmt->fetchAll());
?>