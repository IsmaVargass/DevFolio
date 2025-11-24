<?php
// api/projects/update.php
header('Content-Type: application/json');
require_once '../config/db.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
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

if (!isset($data['id']) || !isset($data['titulo']) || empty(trim($data['titulo']))) {
    http_response_code(400);
    echo json_encode(['error' => 'ID y Título son obligatorios']);
    exit;
}

$id = $data['id'];
$user_id = $_SESSION['user_id'];
$titulo = trim($data['titulo']);
$descripcion = isset($data['descripcion']) ? trim($data['descripcion']) : '';
$imagen_url = isset($data['imagen_url']) ? trim($data['imagen_url']) : '';
$enlace_proyecto = isset($data['enlace_proyecto']) ? trim($data['enlace_proyecto']) : '';
$tecnologias = isset($data['tecnologias']) ? trim($data['tecnologias']) : '';

try {
    // Verificar que el proyecto pertenece al usuario
    $checkStmt = $conn->prepare("SELECT id FROM projects WHERE id = ? AND user_id = ?");
    $checkStmt->execute([$id, $user_id]);
    if (!$checkStmt->fetch()) {
        http_response_code(403);
        echo json_encode(['error' => 'No tienes permiso para editar este proyecto']);
        exit;
    }

    $stmt = $conn->prepare("UPDATE projects SET titulo = ?, descripcion = ?, imagen_url = ?, enlace_proyecto = ?, tecnologias = ? WHERE id = ?");
    if ($stmt->execute([$titulo, $descripcion, $imagen_url, $enlace_proyecto, $tecnologias, $id])) {
        echo json_encode(['message' => 'Proyecto actualizado exitosamente']);
    } else {
        throw new Exception("Error al actualizar proyecto");
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error del servidor: ' . $e->getMessage()]);
}
?>