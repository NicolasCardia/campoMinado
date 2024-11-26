function validateForm() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("error-message");

  // Limpa mensagens anteriores
  errorMessage.textContent = "";

  if (username === "" || password === "") {
      errorMessage.textContent = "Por favor, preencha todos os campos.";
      return false;
  }

  return true;
}

// Exibe mensagem de erro se existir na URL
function showErrorFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get('error');
  const errorMessage = document.getElementById('error-message');

  if (error) {
      errorMessage.textContent = decodeURIComponent(error); // Exibe o erro em texto
  }
}

// Executa a função ao carregar a página
window.onload = showErrorFromURL;
