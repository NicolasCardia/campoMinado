<?php
require_once '../config/conexao.php';

// Verifica se os dados foram enviados
$data = json_decode(file_get_contents('php://input'), true);

if ($data) {
    session_start();
    $idUsuario = $_SESSION['id'];
    $nomeJogador = $data['nomeJogador'];
    $dimensoesCampo = $data['dimensoesCampo'];
    $numeroBombas = $data['numeroBombas'];
    $modalidade = $data['modalidade'];
    $tempoGasto = $data['tempoGasto'];
    $resultado = $data['resultado'];

    try {
        $stmt = $pdo->prepare("
            INSERT INTO informacoes_Partida_Usuario 
            (id_usuario, dimensoes_campo, numero_bombas, modalidade, tempo_gasto, resultado, data_hora) 
            VALUES 
            (:id_usuario, :dimensoes_campo, :numero_bombas, :modalidade, :tempo_gasto, :resultado, NOW())
        ");
        $stmt->execute([
            ':id_usuario' => $idUsuario,
            ':dimensoes_campo' => $dimensoesCampo,
            ':numero_bombas' => $numeroBombas,
            ':modalidade' => $modalidade,
            ':tempo_gasto' => $tempoGasto,
            ':resultado' => $resultado
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Histórico registrado com sucesso.']);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Erro ao registrar histórico: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Dados inválidos.']);
}
?>