const socket = io();

const loginContainer = document.getElementById('login-container');
const registerContainer = document.getElementById('register-container');
const gameContainer = document.getElementById('game-container');
const gameStatus = document.getElementById('game-status');
const startGameBtn = document.getElementById('start-game');
const playerBoard = document.getElementById('player-board');
const opponentBoard = document.getElementById('opponent-board');

let currentGame = null;

// Funciones de autenticación
document.getElementById('login-btn').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    socket.emit('login', { email, password });
});

document.getElementById('register-btn').addEventListener('click', () => {
    const usuario = {
        nombre: document.getElementById('reg-nombre').value,
        apellido: document.getElementById('reg-apellido').value,
        curso: document.getElementById('reg-curso').value,
        paralelo: document.getElementById('reg-paralelo').value,
        email: document.getElementById('reg-email').value,
        fecha_nacimiento: document.getElementById('reg-fecha-nacimiento').value,
        clave: document.getElementById('reg-clave').value
    };
    socket.emit('register', usuario);
    console.log('Boton de registro clickeado')
});
document.getElementById('show-register').addEventListener('click', () => {
    loginContainer.style.display = 'none';
    registerContainer.style.display = 'block';
});

document.getElementById('show-login').addEventListener('click', () => {
    registerContainer.style.display = 'none';
    loginContainer.style.display = 'block';
});

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

// Manejadores de eventos de Socket.IO
socket.on('loginSuccess', (user) => {
    loginContainer.style.display = 'none';
    gameContainer.style.display = 'block';
    gameStatus.textContent = `Bienvenido, ${user.username}!`;
});

socket.on('registerSuccess', () => {
    registerContainer.style.display = 'none';
    loginContainer.style.display = 'block';
    alert('Registro exitoso. Por favor, inicia sesión.');
});

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
    // Esta función necesitará ser implementada según la estructura de tu juego
    actualizarTableros(juego);
});

socket.on('error', (message) => {
    alert(message);
});

function actualizarTableros(juego) {
    // Implementar la lógica para actualizar los tableros
    // basándose en el estado del juego recibido
}

// Inicialización
createBoard(playerBoard);
createBoard(opponentBoard);
setupBoardListeners();