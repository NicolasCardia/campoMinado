<?php
require_once '../config/conexao.php'; // Conexão com o banco de dados

header('Content-Type: application/json');

try {
    // Consulta SQL para obter o ranking global
    $stmt = $pdo->query("
        SELECT 
            u.usuario AS username,
            i.dimensoes_campo AS tabuleiro,
            i.numero_bombas AS bombas,
            i.modalidade AS modalidade,
            i.tempo_gasto AS tempo,
            i.resultado AS resultado,
            i.data_hora AS data_hora
        FROM informacoes_Partida_Usuario i
        JOIN usuarios u ON i.id_usuario = u.id
        WHERE i.resultado = 'Vitória'
        ORDER BY 
            CAST(SUBSTRING_INDEX(i.dimensoes_campo, 'x', 1) AS UNSIGNED) DESC,
            i.tempo_gasto ASC
        LIMIT 10
    ");
    $ranking = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['status' => 'success', 'data' => $ranking]);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Erro ao buscar o ranking: ' . $e->getMessage()]);
}
?>
