<?php
require_once '../config/conexao.php';

session_start();

// Verifica se o usuário está logado
if (!isset($_SESSION['id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Usuário não logado.']);
    exit;
}

$idUsuario = $_SESSION['id']; // Obtém o ID do usuário logado

try {
    // Consulta para buscar o histórico de partidas do usuário logado
    $stmt = $pdo->prepare("
        SELECT 
            u.usuario AS nome_jogador,
            i.dimensoes_campo,
            i.numero_bombas,
            i.modalidade,
            i.tempo_gasto,
            i.resultado,
            i.data_hora
        FROM informacoes_Partida_Usuario i
        JOIN usuarios u ON i.id_usuario = u.id
        WHERE i.id_usuario = :id_usuario
        ORDER BY i.data_hora DESC
    ");
    $stmt->execute(['id_usuario' => $idUsuario]);
    $historico = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['status' => 'success', 'data' => $historico]);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Erro ao buscar histórico: ' . $e->getMessage()]);
}
?>
