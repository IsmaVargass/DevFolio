<?php
// api/messages/create.php
header('Content-Type: application/json');
require_once '../config/db.php';

// Este endpoint puede ser público si queremos que cualquiera contacte
// Pero necesitamos saber a QUIÉN se lo envían. 
// Por simplicidad, asumiremos que se envía al usuario logueado O se debe pasar un user_id destino.
// Dado que es un portfolio personal, normalmente el dueño es uno. Pero como es multiusuario, 
// el frontend debe indicar a qué user_id va dirigido.
// OJO: Si es para contactar al dueño del portfolio, el sender NO necesita estar logueado.

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['user_id']) || !isset($data['sender_name']) || !isset($data['sender_email']) || !isset($data['message'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Faltan datos']);
    exit;
}

try {
    $stmt = $conn->prepare("INSERT INTO messages (user_id, sender_name, sender_email, message) VALUES (?, ?, ?, ?)");
    $stmt->execute([
        $data['user_id'],
        $data['sender_name'],
        $data['sender_email'],
        $data['message']
    ]);
    echo json_encode(['message' => 'Mensaje enviado']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>