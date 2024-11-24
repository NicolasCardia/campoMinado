let boardSize = 10;
let bombCount = 15;
let gameMode = 'rivotril';
let board = [];
let gameOver = false;
let cheatMode = false;
let startTime = null;
let gameInterval = null;
let timeLeft = null;
let cheatModeTimeout = null;
let score = 0;
let cellsRevealed = 0;

// Obtém o nome do jogador da sessão via variável global passada pelo back-end
const nomeJogador = document.body.dataset.nomeJogador || 'Jogador';

// Inicializa o jogo
function initializeGame() {
    boardSize = parseInt(document.querySelector('.select-tabuleiro').value);
    bombCount = parseInt(document.querySelector('.select-bombas').value);
    gameMode = document.querySelector('.select-modalidade').value;
    initializeBoard();
    renderBoard();
    resetGame();
    startGameTimer();
}

// Pega a modal do HTML
function showModal(message) {
    const modalBody = document.getElementById('gameModalBody');
    modalBody.textContent = message;

    const modal = new bootstrap.Modal(document.getElementById('gameModal'));
    modal.show();
}

// Reseta o jogo
function resetGame() {
    score = 0;
    cellsRevealed = 0;
    gameOver = false;
    document.getElementById('pontuacao').textContent = score;
    document.getElementById('tempoPartida').textContent = '00:00';
    clearInterval(gameInterval);

    if (gameMode === 'rivotril') {
        switch (boardSize) {
            case 5:
                timeLeft = 180;
                break;
            case 10:
                timeLeft = 300;
                break;
            case 15:
                timeLeft = 650;
                break;
            default:
                timeLeft = 300; // Valor padrão
        }
    } else {
        timeLeft = 300;
    }
}

// Inicia o temporizador do jogo
function startGameTimer() {
    startTime = Date.now();
    gameInterval = setInterval(updateGameTime, 1000);
}

// Atualiza o contador de tempo
function updateGameTime() {
    if (gameMode === 'rivotril' && timeLeft !== null) {
        timeLeft--;

        if (timeLeft <= 0) {
            clearInterval(gameInterval);
            gameOver = true;
            showModal('Game Over! O tempo acabou no modo Rivotril.');
            revealAllMines();
            registrarHistorico(
                nomeJogador,
                `${boardSize}x${boardSize}`,
                bombCount,
                gameMode,
                'Tempo Esgotado',
                'Derrota'
            );
            resetGame();
        }

        const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        const seconds = (timeLeft % 60).toString().padStart(2, '0');
        document.getElementById('tempoPartida').textContent = `${minutes}:${seconds}`;
    } else {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
        const seconds = (elapsedTime % 60).toString().padStart(2, '0');
        document.getElementById('tempoPartida').textContent = `${minutes}:${seconds}`;
    }
}

// Inicializa o tabuleiro com minas e números
function initializeBoard() {
    board = [];
    gameOver = false;
    for (let i = 0; i < boardSize; i++) {
        board.push(Array(boardSize).fill().map(() => ({ isMine: false, isRevealed: false, neighborMines: 0 })));
    }

    let bombsPlaced = 0;
    while (bombsPlaced < bombCount) {
        const row = Math.floor(Math.random() * boardSize);
        const col = Math.floor(Math.random() * boardSize);
        if (!board[row][col].isMine) {
            board[row][col].isMine = true;
            bombsPlaced++;
        }
    }

    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (!board[row][col].isMine) {
                board[row][col].neighborMines = countNeighborMines(row, col);
            }
        }
    }
}

// Conta o número de minas ao redor de uma célula
function countNeighborMines(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                if (board[newRow][newCol].isMine) {
                    count++;
                }
            }
        }
    }
    return count;
}

// Renderiza o tabuleiro na interface
function renderBoard() {
    const gameBoard = document.getElementById('campoMinado');
    gameBoard.innerHTML = '';
    for (let row = 0; row < boardSize; row++) {
        const rowElement = document.createElement('div');
        rowElement.className = 'd-flex justify-content-center';
        for (let col = 0; col < boardSize; col++) {
            const cell = board[row][col];
            const cellButton = document.createElement('button');
            cellButton.className = 'btn btn-outline-secondary btn-cell';
            cellButton.onclick = () => handleCellClick(row, col);

            if (cell.isRevealed) {
                cellButton.classList.add('revealed');
                if (cell.isMine) {
                    cellButton.classList.add('mine');
                } else if (cell.neighborMines > 0) {
                    cellButton.textContent = cell.neighborMines;
                }
            } else if (cheatMode && cell.isMine) {
                cellButton.classList.add('mine');
            }

            rowElement.appendChild(cellButton);
        }
        gameBoard.appendChild(rowElement);
    }
}

// Trata o clique em uma célula
function handleCellClick(row, col) {
    if (gameOver || board[row][col].isRevealed) return;

    if (board[row][col].isMine) {
        gameOver = true;
        revealAllMines();
        clearInterval(gameInterval);
        const tempoFinal = document.getElementById('tempoPartida').textContent;
        registrarHistorico(
            nomeJogador,
            `${boardSize}x${boardSize}`,
            bombCount,
            gameMode,
            tempoFinal,
            'Derrota'
        );
        showModal('Game Over! Você clicou em uma bomba.');
    } else {
        revealCell(row, col);
        score++;
        document.getElementById('pontuacao').textContent = score;

        checkForWin();
    }

    renderBoard();
}

// Revela uma célula
function revealCell(row, col) {
    if (row < 0 || row >= boardSize || col < 0 || col >= boardSize || board[row][col].isRevealed) return;

    board[row][col].isRevealed = true;
    cellsRevealed++;

    if (board[row][col].neighborMines === 0) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                revealCell(row + i, col + j);
            }
        }
    }
}

//Mostra onde estão as minas terrestres
function revealAllMines() {
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (board[row][col].isMine) {
                board[row][col].isRevealed = true;
            }
        }
    }
}

// Carrega o script do confetti.js para lançar confetes quando o jogador ganha
function loadConfettiScript() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js';
    document.head.appendChild(script);
}

loadConfettiScript();

//checa se todas as celular com numero foram selecionadas
function checkForWin() {
    const totalCells = boardSize * boardSize;
    const nonMineCells = totalCells - bombCount;

    if (cellsRevealed === nonMineCells) {
        clearInterval(gameInterval);
        gameOver = true;
        showModal('Você ganhou!');
    
        const tempoFinal = document.getElementById('tempoPartida').textContent;
    
        registrarHistorico(
            'Usuário Atual', // O nome do jogador pode ser obtido da sessão
            `${boardSize}x${boardSize}`,
            bombCount,
            gameMode,
            tempoFinal,
            'Vitória'
        );
    
        // Confetti e reiniciar
        let params = {
            particleCount: 500, 
            spread: 90, 
            startVelocity: 70, 
            origin: { x: 0, y: 0.5 }, 
            angle: 45 
        };
        confetti(params);
        params.origin.x = 1;
        params.angle = 135;
        confetti(params);
    
        initializeGame();
    }
}

//Ativa o moda trapaça
function toggleCheatMode() {
    cheatMode = true;
    const cheatButton = document.querySelector('.cheat-button');
    cheatButton.textContent = 'Desativar Modo Trapaça';
    cheatButton.classList.remove('btn-outline-danger');
    cheatButton.classList.add('btn-danger');
    
    renderBoard();

    if (cheatModeTimeout) {
        clearTimeout(cheatModeTimeout);
    }
    
    cheatModeTimeout = setTimeout(() => {
        cheatMode = false;
        cheatButton.textContent = 'Ativar Modo Trapaça';
        cheatButton.classList.remove('btn-danger');
        cheatButton.classList.add('btn-outline-danger');
        renderBoard();
    }, 2000);
}


// Registra o histórico da partida
function registrarHistorico(nomeJogador, dimensoesCampo, numeroBombas, modalidade, tempoGasto, resultado) {
    const data = {
        nomeJogador,
        dimensoesCampo,
        numeroBombas,
        modalidade,
        tempoGasto,
        resultado,
    };

    fetch('./registrarHistorico.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(result => {
            console.log('Histórico registrado:', result);
        })
        .catch(error => {
            console.error('Erro ao registrar histórico:', error);
        });
}

// Função para carregar o histórico de partidas do usuário logado
function carregarHistorico() {
    fetch('./obterHistorico.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(result => {
            if (result.status === 'success') {
                preencherHistorico(result.data);
            } else {
                console.error('Erro ao carregar histórico:', result.message);
            }
        })
        .catch(error => {
            console.error('Erro ao carregar histórico:', error);
        });
}

// Preenche a tabela de histórico com os dados recebidos do back-end
function preencherHistorico(historico) {
    const historicoTable = document.getElementById('historicoPartidas');
    historicoTable.innerHTML = ''; // Limpa a tabela antes de preencher

    if (historico.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 7;
        cell.textContent = 'Nenhuma partida registrada.';
        cell.className = 'text-center';
        row.appendChild(cell);
        historicoTable.appendChild(row);
        return;
    }

    historico.forEach(partida => {
        const row = document.createElement('tr');

        const nomeJogadorCell = document.createElement('td');
        nomeJogadorCell.textContent = partida.nome_jogador;
        row.appendChild(nomeJogadorCell);

        const dimensoesCampoCell = document.createElement('td');
        dimensoesCampoCell.textContent = partida.dimensoes_campo;
        row.appendChild(dimensoesCampoCell);

        const numeroBombasCell = document.createElement('td');
        numeroBombasCell.textContent = partida.numero_bombas;
        row.appendChild(numeroBombasCell);

        const modalidadeCell = document.createElement('td');
        modalidadeCell.textContent = partida.modalidade;
        row.appendChild(modalidadeCell);

        const tempoGastoCell = document.createElement('td');
        tempoGastoCell.textContent = partida.tempo_gasto;
        row.appendChild(tempoGastoCell);

        const resultadoCell = document.createElement('td');
        resultadoCell.textContent = partida.resultado;
        row.appendChild(resultadoCell);

        const dataHoraCell = document.createElement('td');
        dataHoraCell.textContent = new Date(partida.data_hora).toLocaleString('pt-BR');
        row.appendChild(dataHoraCell);

        historicoTable.appendChild(row);
    });
}

// Relaciona os botões do HTML com as funções
document.addEventListener('DOMContentLoaded', () => {
    carregarHistorico();
    document.querySelector('.select-tabuleiro').addEventListener('change', initializeGame);
    document.querySelector('.select-bombas').addEventListener('change', initializeGame);
    document.querySelector('.select-modalidade').addEventListener('change', initializeGame);
    document.querySelector('.cheat-button').addEventListener('click', toggleCheatMode);
    document.getElementById('reiniciarJogo').addEventListener('click', initializeGame);
    initializeGame();
});
