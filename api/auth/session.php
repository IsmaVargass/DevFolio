<?php
// api/auth/session.php
header('Content-Type: application/json');
session_start();

require_once '../config/db.php';

if (isset($_SESSION['user_id'])) {
    try {
        $stmt = $conn->prepare("SELECT id, nombre, email, role FROM users WHERE id = ?");
        $stmt->execute([$_SESSION['user_id']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            // Actualizar datos de sesión por si acaso
            $_SESSION['user_nombre'] = $user['nombre'];
            $_SESSION['user_role'] = $user['role'];

            echo json_encode([
                'authenticated' => true,
                'user' => $user
            ]);
        } else {
            // Usuario no encontrado en BD (borrado?)
            session_destroy();
            echo json_encode(['authenticated' => false]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al verificar sesión']);
    }
} else {
    // No devolvemos 401 aquí necesariamente, solo informamos que no hay sesión
    echo json_encode([
        'authenticated' => false
    ]);
}
?>