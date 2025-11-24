<?php
// api/testimonials/list.php
header('Content-Type: application/json');
require_once '../config/db.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM testimonials WHERE user_id = ?");
$stmt->execute([$_SESSION['user_id']]);
echo json_encode($stmt->fetchAll());
?>