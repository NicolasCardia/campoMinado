<?php
require_once '../config/conexao.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome_completo = $_POST['nome_completo'];
    $data_nascimento = $_POST['data_nascimento'];
    $cpf = $_POST['cpf'];
    $telefone = $_POST['telefone'];
    $email = $_POST['email'];
    $usuario = $_POST['usuario'];
    $senha = $_POST['senha'];

    try {
        // Verificar se o CPF ou e-mail já estão cadastrados
        $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE cpf = :cpf OR email = :email");
        $stmt->execute(['cpf' => $cpf, 'email' => $email]);
        if ($stmt->rowCount() > 0) {
            echo "<script>
                    alert('CPF ou e-mail já cadastrados!');
                    window.history.back();
                  </script>";
            exit;
        }

        // Hash da senha
        $senha_hash = password_hash($senha, PASSWORD_DEFAULT);

        $stmt = $pdo->prepare("
            INSERT INTO usuarios (nome_completo, data_nascimento, cpf, telefone, email, usuario, senha)
            VALUES (:nome_completo, :data_nascimento, :cpf, :telefone, :email, :usuario, :senha)
        ");
        $stmt->execute([
            'nome_completo' => $nome_completo,
            'data_nascimento' => $data_nascimento,
            'cpf' => $cpf,
            'telefone' => $telefone,
            'email' => $email,
            'usuario' => $usuario,
            'senha' => $senha_hash
        ]);

        echo "<script>
                window.location.href = 'cadastro.html?success=true';
              </script>";
    } catch (PDOException $e) {
        echo "Erro ao cadastrar usuário: " . $e->getMessage();
    }
} else {
    echo "Método de requisição inválido.";
}
?>
