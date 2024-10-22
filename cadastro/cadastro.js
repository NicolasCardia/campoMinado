function validateForm() {
  var nome = document.getElementById("nome").value;
  var dataNascimento = document.getElementById("dataNascimento").value;
  var cpf = document.getElementById("cpf").value;
  var telefone = document.getElementById("telefone").value;
  var email = document.getElementById("email").value;
  var username = document.getElementById("username").value;
  var senha = document.getElementById("senha").value;

  if (nome === "" || dataNascimento === "" || cpf === "" || telefone === "" || email === "" || username === "" || senha === "") {
      alert("Por favor, preencha todos os campos.");
      return false;
  }

  return true;
}