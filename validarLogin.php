<?php
require_once './config/conexao.php'; // Inclui a conexão com o banco de dados

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usuario = $_POST['usuario'];
    $senha = $_POST['senha'];

    try {
        // Verificar se o usuário existe no banco de dados
        $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE usuario = :usuario");
        $stmt->execute(['usuario' => $usuario]);

        $usuarioData = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($usuarioData && password_verify($senha, $usuarioData['senha'])) {
            // Login bem-sucedido
            session_start();
            $_SESSION['usuario'] = $usuarioData['usuario'];
            $_SESSION['id'] = $usuarioData['id'];
            header('Location: campoMinado/campoMinado.html');
            exit;
        } else {
            // Login falhou
            header('Location: main.html?error=Usuário ou senha incorretos');
            exit;
        }
    } catch (PDOException $e) {
        header('Location: main.html?error=Erro no servidor. Tente novamente mais tarde.');
        exit;
    }
} else {
    header('Location: main.html?error=Método de requisição inválido.');
    exit;
}
?>
