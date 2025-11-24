<?php
// api/projects/create.php
header('Content-Type: application/json');
require_once '../config/db.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
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

if (!isset($data['titulo']) || empty(trim($data['titulo']))) {
    http_response_code(400);
    echo json_encode(['error' => 'El título es obligatorio']);
    exit;
}

$user_id = $_SESSION['user_id'];
$titulo = trim($data['titulo']);
$descripcion = isset($data['descripcion']) ? trim($data['descripcion']) : '';
$imagen_url = isset($data['imagen_url']) ? trim($data['imagen_url']) : '';
$enlace_proyecto = isset($data['enlace_proyecto']) ? trim($data['enlace_proyecto']) : '';
$tecnologias = isset($data['tecnologias']) ? trim($data['tecnologias']) : '';

try {
    $stmt = $conn->prepare("INSERT INTO projects (user_id, titulo, descripcion, imagen_url, enlace_proyecto, tecnologias) VALUES (?, ?, ?, ?, ?, ?)");
    if ($stmt->execute([$user_id, $titulo, $descripcion, $imagen_url, $enlace_proyecto, $tecnologias])) {
        http_response_code(201);
        echo json_encode(['message' => 'Proyecto creado exitosamente', 'id' => $conn->lastInsertId()]);
    } else {
        throw new Exception("Error al crear proyecto");
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error del servidor: ' . $e->getMessage()]);
}
?>