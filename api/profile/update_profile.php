<?php
// api/profile/update_profile.php
// Endpoint para actualizar los datos del perfil
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
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Datos inválidos']);
    exit;
}

try {
    // Definir campos permitidos para actualización
    $allowedFields = ['nombre', 'bio', 'location', 'phone', 'job_title', 'company', 'website', 'github', 'linkedin', 'twitter'];

    $updates = [];
    $params = [];

    foreach ($allowedFields as $field) {
        if (isset($data[$field])) {
            $updates[] = "$field = ?";
            $params[] = trim($data[$field]);
        }
    }

    if (empty($updates)) {
        echo json_encode(['message' => 'Nada que actualizar', 'user' => $data]);
        exit;
    }

    // Actualizar fecha de modificación
    $updates[] = "last_updated = NOW()";

    // Añadir ID de usuario para el WHERE
    $params[] = $userId;

    $sql = "UPDATE users SET " . implode(', ', $updates) . " WHERE id = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt->execute($params)) {
        echo json_encode(['message' => 'Perfil actualizado correctamente']);
    } else {
        throw new Exception("Error al actualizar perfil");
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error del servidor: ' . $e->getMessage()]);
}
?>