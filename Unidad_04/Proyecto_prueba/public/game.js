// game.js

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar el socket
    const socket = io();

    // Estado del juego
    const gameState = {
        playerBoard: Array(10).fill().map(() => Array(10).fill(0)),
        opponentBoard: Array(10).fill().map(() => Array(10).fill(0)),
        currentShip: null,
        isVertical: false,
        gameId: null,
        isMyTurn: false,
        searching: false // Variable para controlar la búsqueda de partidas
    };

    // Configurar los event listeners
    document.getElementById('create-game').addEventListener('click', createGame);
    document.getElementById('join-game-btn').addEventListener('click', joinGame);
    document.getElementById('rotate-ship').addEventListener('click', rotateShip);
    document.getElementById('place-ship').addEventListener('click', selectShipToPlace);
    document.getElementById('cancel-search').addEventListener('click', cancelSearch);

    function createGame() {
        if (gameState.searching) return; // No permitir crear una nueva partida si ya se está buscando una

        console.log('Intentando crear una partida...');
        gameState.searching = true;
        document.getElementById('waiting-message').style.display = 'block';
        document.getElementById('cancel-search').style.display = 'block'; // Mostrar botón de cancelar búsqueda
        socket.emit('createGame', (response) => {
            console.log('Respuesta del servidor:', response);
            if (response && response.success) {
                gameState.gameId = response.gameId;
                updateGameStatus('Esperando a otro jugador. Código de partida: ' + response.gameId);
            } else {
                updateGameStatus('Error al crear la partida: ' + (response ? response.message : 'No se recibió respuesta del servidor'));
                gameState.searching = false; // Restablecer el estado de búsqueda en caso de error
                document.getElementById('waiting-message').style.display = 'none'; // Ocultar mensaje de espera
                document.getElementById('cancel-search').style.display = 'none'; // Ocultar botón de cancelar
            }
        });
    }

    function cancelSearch() {
        if (!gameState.searching) return; // Solo permitir cancelar si se está buscando una partida

        console.log('Cancelando búsqueda de partida...');
        gameState.searching = false;
        document.getElementById('waiting-message').style.display = 'none';
        document.getElementById('cancel-search').style.display = 'none'; // Ocultar botón de cancelar
        socket.emit('cancelSearch', { gameId: gameState.gameId }); // Enviar solicitud al servidor para cancelar la búsqueda
        updateGameStatus('Búsqueda de partida cancelada.');
    }

    function updateGameStatus(message) {
        document.getElementById('game-status').textContent = message;
    }

    // Implementa otras funciones aquí...

    // Manejar eventos del socket
    socket.on('connect', () => {
        console.log('Conectado al servidor Socket.io');
    });

    socket.on('error', (error) => {
        console.error('Error de socket:', error);
    });

    socket.on('gameStart', () => {
        console.log('La partida ha comenzado');
        updateGameStatus('¡La partida ha comenzado!');
        gameState.isMyTurn = true;
    });

    socket.on('opponentMove', ({ x, y, hit }) => {
        console.log('Movimiento del oponente:', { x, y, hit });
        const cell = document.querySelector(`#player-board .cell[data-x="${x}"][data-y="${y}"]`);
        cell.classList.add(hit ? 'hit' : 'miss');
        gameState.isMyTurn = true;
        updateGameStatus('Tu turno');
    });

    socket.on('gameOver', (winner) => {
        console.log('Juego terminado. Ganador:', winner);
        updateGameStatus(winner === socket.id ? '¡Has ganado!' : 'Has perdido.');
    });
});
