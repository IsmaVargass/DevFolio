<?php
// api/profile/upload_avatar.php
// Endpoint para subir foto de perfil
header('Content-Type: application/json');
require_once '../config/db.php';

session_start();

// Verificar autorización
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'No autorizado']);
    exit;
}

$userId = $_SESSION['user_id'];

if (!isset($_FILES['avatar'])) {
    http_response_code(400);
    echo json_encode(['error' => 'No se subió ningún archivo']);
    exit;
}

$file = $_FILES['avatar'];
$uploadDir = __DIR__ . '/../../uploads/avatars/';

// Validaciones
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
$maxSize = 5 * 1024 * 1024; // 5MB

if (!in_array($file['type'], $allowedTypes)) {
    http_response_code(400);
    echo json_encode(['error' => 'Tipo de archivo no permitido']);
    exit;
}

if ($file['size'] > $maxSize) {
    http_response_code(400);
    echo json_encode(['error' => 'El archivo es demasiado grande (Máx 5MB)']);
    exit;
}

// Generar nombre de archivo único
$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = 'avatar_' . $userId . '_' . time() . '.' . $ext;
$targetPath = $uploadDir . $filename;

// Mover archivo y actualizar BBDD
if (move_uploaded_file($file['tmp_name'], $targetPath)) {
    try {
        // Actualizar referencia en la base de datos
        $stmt = $conn->prepare("UPDATE users SET profile_photo = ? WHERE id = ?");
        $stmt->execute([$filename, $userId]);

        // Devolver la nueva URL
        $url = '/DevFolio/uploads/avatars/' . $filename;
        echo json_encode(['message' => 'Avatar actualizado', 'url' => $url]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al guardar en base de datos']);
    }
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Error al mover el archivo subido']);
}
?>