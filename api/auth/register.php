<?php
// api/auth/register.php
header('Content-Type: application/json');
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['nombre']) || !isset($data['email']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Datos incompletos']);
    exit;
}

$nombre = trim($data['nombre']);
$email = trim($data['email']);
$password = $data['password'];

if (empty($nombre) || empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['error' => 'Los campos no pueden estar vacíos']);
    exit;
}

// Validar email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Email inválido']);
    exit;
}

try {
    // Verificar si el email ya existe
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['error' => 'El email ya está registrado']);
        exit;
    }

    // Hashear contraseña
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    // Insertar usuario
    $stmt = $conn->prepare("INSERT INTO users (nombre, email, password) VALUES (?, ?, ?)");
    if ($stmt->execute([$nombre, $email, $passwordHash])) {
        $userId = $conn->lastInsertId();

        // Iniciar sesión automáticamente
        session_start();
        $_SESSION['user_id'] = $userId;
        $_SESSION['user_nombre'] = $nombre;
        $_SESSION['user_role'] = 'user'; // Default role

        http_response_code(201);
        echo json_encode([
            'message' => 'Usuario registrado exitosamente',
            'user' => [
                'id' => $userId,
                'nombre' => $nombre,
                'email' => $email,
                'role' => 'user'
            ]
        ]);
    } else {
        throw new Exception("Error al insertar usuario");
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error del servidor: ' . $e->getMessage()]);
}
?>