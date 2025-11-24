<?php
// api/auth/logout.php
header('Content-Type: application/json');
session_start();

session_unset();
session_destroy();

echo json_encode(['message' => 'Sesión cerrada exitosamente']);
?>