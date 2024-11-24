function validateForm() {
  const nome = document.getElementById('nome').value;
  const cpf = document.getElementById('cpf').value;
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  if (nome === '' || cpf === '' || email === '' || senha === '') {
      alert("Por favor, preencha todos os campos obrigatórios!");
      return false;
  }

  //valida o cpf
  if (!/^\d{11}$/.test(cpf)) {
      alert("CPF inválido. Por favor, digite um CPF com 11 números.");
      return false;
  }

  // Validação de e-mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
      alert("Por favor, insira um e-mail válido.");
      return false;
  }

  return true;
}
console.log(bootstrap);
function showModal() {
  const successModal = new bootstrap.Modal(document.getElementById('successModal'));
  successModal.show();
}

// Redirecionar para a página de login
function redirectToLogin() {
  window.location.href = '../main.html';
}

// Verificar o parâmetro na URL
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('success') === 'true') {
  showModal();
}
