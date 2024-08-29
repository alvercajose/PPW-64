const gameStatus = document.getElementById('game-status');
const startGameBtn = document.getElementById('start-game');
const playerBoard = document.getElementById('player-board');
const opponentBoard = document.getElementById('opponent-board');

let currentGame = null;

// Funciones del juego
startGameBtn.addEventListener('click', () => {
    socket.emit('buscarPartida');
    gameStatus.textContent = 'Buscando partida...';
});

function createBoard(boardElement) {
    for (let i = 0; i < 100; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        boardElement.appendChild(cell);
    }
}

function setupBoardListeners() {
    opponentBoard.addEventListener('click', (e) => {
        if (e.target.classList.contains('cell') && currentGame) {
            const index = e.target.dataset.index;
            const x = index % 10;
            const y = Math.floor(index / 10);
            socket.emit('realizarMovimiento', { juegoId: currentGame._id, x, y });
        }
    });
}

// Manejadores de eventos de Socket.IO para el juego
socket.on('partidaEncontrada', (juego) => {
    currentGame = juego;
    gameStatus.textContent = 'Partida encontrada. ¡Comienza el juego!';
    createBoard(playerBoard);
    createBoard(opponentBoard);
    setupBoardListeners();
});

socket.on('actualizacionJuego', (juego) => {
    currentGame = juego;
    // Actualizar los tableros basados en el estado del juego
    actualizarTableros(juego);
});

function actualizarTableros(juego) {
    // Implementar la lógica para actualizar los tableros
    // basándose en el estado del juego recibido
}

// Inicialización del juego
createBoard(playerBoard);
createBoard(opponentBoard);
setupBoardListeners();
