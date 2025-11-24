<?php
// api/projects/delete.php
header('Content-Type: application/json');
require_once '../config/db.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'No autorizado']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'ID del proyecto es obligatorio']);
    exit;
}

$id = $data['id'];
$user_id = $_SESSION['user_id'];

try {
    // Verificar que el proyecto pertenece al usuario
    $checkStmt = $conn->prepare("SELECT id FROM projects WHERE id = ? AND user_id = ?");
    $checkStmt->execute([$id, $user_id]);
    if (!$checkStmt->fetch()) {
        http_response_code(403);
        echo json_encode(['error' => 'No tienes permiso para eliminar este proyecto']);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM projects WHERE id = ?");
    if ($stmt->execute([$id])) {
        echo json_encode(['message' => 'Proyecto eliminado exitosamente']);
    } else {
        throw new Exception("Error al eliminar proyecto");
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error del servidor: ' . $e->getMessage()]);
}
?>