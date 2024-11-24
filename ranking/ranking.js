// Função para carregar o ranking global
function carregarRanking() {
  fetch('./obterRanking.php', {
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
              preencherRanking(result.data);
          } else {
              console.error('Erro ao carregar ranking:', result.message);
          }
      })
      .catch(error => {
          console.error('Erro ao carregar ranking:', error);
      });
}

// Preenche a tabela com os dados do ranking
function preencherRanking(ranking) {
  const rankingTable = document.getElementById('rankingTable');
  rankingTable.innerHTML = ''; // Limpa a tabela antes de preencher

  if (ranking.length === 0) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = 8;
      cell.textContent = 'Nenhum dado disponível no ranking.';
      cell.className = 'text-center';
      row.appendChild(cell);
      rankingTable.appendChild(row);
      return;
  }

  ranking.forEach((jogador, index) => {
      const row = document.createElement('tr');

      const posicaoCell = document.createElement('td');
      posicaoCell.textContent = `${index + 1}º`;
      row.appendChild(posicaoCell);

      const usernameCell = document.createElement('td');
      usernameCell.textContent = jogador.username;
      row.appendChild(usernameCell);

      const tabuleiroCell = document.createElement('td');
      tabuleiroCell.textContent = jogador.tabuleiro;
      row.appendChild(tabuleiroCell);

      const bombasCell = document.createElement('td');
      bombasCell.textContent = jogador.bombas;
      row.appendChild(bombasCell);

      const modalidadeCell = document.createElement('td');
      modalidadeCell.textContent = jogador.modalidade;
      row.appendChild(modalidadeCell);

      const tempoCell = document.createElement('td');
      tempoCell.textContent = jogador.tempo;
      row.appendChild(tempoCell);

      const resultadoCell = document.createElement('td');
      resultadoCell.textContent = jogador.resultado;
      row.appendChild(resultadoCell);

      const dataHoraCell = document.createElement('td');
      dataHoraCell.textContent = new Date(jogador.data_hora).toLocaleString('pt-BR');
      row.appendChild(dataHoraCell);

      rankingTable.appendChild(row);
  });
}

// Carrega o ranking ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  carregarRanking();
});
