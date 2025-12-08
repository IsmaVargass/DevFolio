<?php
// api/profile/get_profile.php
// Endpoint para obtener los datos del perfil de usuario
header('Content-Type: application/json');
require_once '../config/db.php';

session_start();

// Verificar si el usuario ha iniciado sesión
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'No autorizado']);
    exit;
}

$userId = $_SESSION['user_id'];

try {
    // Seleccionar todos los campos del usuario
    $stmt = $conn->prepare("SELECT id, nombre, email, role, profile_photo, bio, location, phone, job_title, company, website, github, linkedin, twitter, member_since, last_updated FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    if ($user) {
        // Asegurar que la URL de la foto de perfil sea completa si existe
        if ($user['profile_photo'] && !str_starts_with($user['profile_photo'], 'http') && !str_starts_with($user['profile_photo'], 'data:')) {
            $user['profile_photo'] = '/DevFolio/uploads/avatars/' . $user['profile_photo'];
        }

        echo json_encode(['user' => $user]);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Usuario no encontrado']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error del servidor: ' . $e->getMessage()]);
}
?>