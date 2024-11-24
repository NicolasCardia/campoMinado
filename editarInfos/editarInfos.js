// Função para carregar os dados do usuário
function carregarDadosUsuario() {
  fetch('./obterUsuario.php', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      },
  })
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
      })
      .then(result => {
          if (result.status === 'success') {
              preencherFormulario(result.data);
          } else {
              console.error('Erro ao carregar dados do usuário:', result.message);
          }
      })
      .catch(error => {
          console.error('Erro ao carregar dados do usuário:', error);
      });
}

// Preenche o formulário com os dados do usuário
function preencherFormulario(dados) {
  document.getElementById('full_name').value = dados.nome_completo;
  document.getElementById('birth_date').value = dados.data_nascimento;
  document.getElementById('cpf').value = dados.cpf;
  document.getElementById('phone').value = dados.telefone;
  document.getElementById('email').value = dados.email;
  document.getElementById('username').value = dados.usuario;
}

// Submete o formulário e trata a resposta
document.getElementById('editarUsuarioForm').addEventListener('submit', function (event) {
  event.preventDefault(); // Impede o envio padrão do formulário

  const formData = new FormData(this);

  fetch('./atualizarUsuario.php', {
      method: 'POST',
      body: formData,
  })
      .then(response => response.json())
      .then(result => {
          if (result.status === 'success') {
              exibirModal(
                  'Sucesso',
                  'Informações atualizadas com sucesso!',
                  '../campoMinado/campoMinado.html'
              );
          } else {
              exibirModal(
                  'Erro',
                  `Erro ao atualizar informações: ${result.message}`,
                  null
              );
          }
      })
      .catch(error => {
          exibirModal(
              'Erro',
              `Erro inesperado: ${error.message}`,
              null
          );
      });
});

// Exibe a modal de feedback
function exibirModal(titulo, mensagem, redirecionar) {
  const modalTitle = document.getElementById('feedbackModalLabel');
  const modalBody = document.getElementById('feedbackModalBody');
  const modalButton = document.getElementById('feedbackModalButton');

  modalTitle.textContent = titulo;
  modalBody.textContent = mensagem;

  const modal = new bootstrap.Modal(document.getElementById('feedbackModal'));
  modal.show();

  // Configura o botão "OK" para redirecionar ou permanecer na página
  modalButton.onclick = function () {
      if (redirecionar) {
          window.location.href = redirecionar;
      }
  };
}

// Carrega os dados do usuário ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  carregarDadosUsuario();
});
