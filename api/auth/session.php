<?php
// api/auth/session.php
header('Content-Type: application/json');
session_start();

if (isset($_SESSION['user_id'])) {
    echo json_encode([
        'authenticated' => true,
        'user' => [
            'id' => $_SESSION['user_id'],
            'nombre' => $_SESSION['user_nombre']
        ]
    ]);
} else {
    // No devolvemos 401 aquí necesariamente, solo informamos que no hay sesión
    echo json_encode([
        'authenticated' => false
    ]);
}
?>