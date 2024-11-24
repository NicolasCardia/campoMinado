<?php
require_once '../config/conexao.php'; // Conexão com o banco de dados
session_start();

header('Content-Type: application/json');

// Verifica se o usuário está logado
if (!isset($_SESSION['id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Usuário não logado.']);
    exit;
}

$idUsuario = $_SESSION['id']; // ID do usuário logado

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nomeCompleto = $_POST['full_name'] ?? null;
    $telefone = $_POST['phone'] ?? null;
    $email = $_POST['email'] ?? null;
    $senha = $_POST['password'] ?? null;

    try {
        // Atualizar informações no banco de dados
        $stmt = $pdo->prepare("
            UPDATE usuarios 
            SET nome_completo = :nome_completo, 
                telefone = :telefone, 
                email = :email,
                senha = :senha 
            WHERE id = :id
        ");

        $stmt->execute([
            ':nome_completo' => $nomeCompleto,
            ':telefone' => $telefone,
            ':email' => $email,
            ':senha' => password_hash($senha, PASSWORD_DEFAULT), // Salva a senha de forma segura
            ':id' => $idUsuario
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Informações atualizadas com sucesso.']);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Erro ao atualizar informações: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Método inválido.']);
}
?>
