<?php
require_once '../config/conexao.php';
session_start();

header('Content-Type: application/json');

// Verifica se o usuário está logado
if (!isset($_SESSION['id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Usuário não logado.']);
    exit;
}

$idUsuario = $_SESSION['id']; // ID do usuário logado

try {
    // Busca os dados do usuário no banco de dados
    $stmt = $pdo->prepare("SELECT nome_completo, data_nascimento, cpf, telefone, email, usuario FROM usuarios WHERE id = :id");
    $stmt->execute([':id' => $idUsuario]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($usuario) {
        echo json_encode(['status' => 'success', 'data' => $usuario]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Usuário não encontrado.']);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Erro ao buscar informações do usuário: ' . $e->getMessage()]);
}
?>
