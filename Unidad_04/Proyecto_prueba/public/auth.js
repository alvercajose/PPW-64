const loginContainer = document.getElementById('login-container');
const registerContainer = document.getElementById('register-container');
const gameContainer = document.getElementById('game-container');

// Login function
document.getElementById('login-btn').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log('Intentando iniciar sesion con: ', email);
    socket.emit('login', { email, password });
});

// Register function
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
    console.log('Botón de registro clickeado');
});

// Toggle between login and register forms
document.getElementById('show-register').addEventListener('click', () => {
    loginContainer.style.display = 'none';
    registerContainer.style.display = 'block';
});

document.getElementById('show-login').addEventListener('click', () => {
    registerContainer.style.display = 'none';
    loginContainer.style.display = 'block';
});

// Socket.IO event handlers for authentication
socket.on('loginSuccess', (user) => {
    loginContainer.style.display = 'none';
    gameContainer.style.display = 'block';
    document.getElementById('game-container').style.display = 'block';

    document.getElementById('game-status').textContent = `Bienvenido, ${user.nombre}!`;
    
    // Here you would call a function to initialize and display your game tables
    initializeGame();
});

socket.on('registerSuccess', () => {
    registerContainer.style.display = 'none';
    loginContainer.style.display = 'block';
    alert('Registro exitoso. Por favor, inicia sesión.');
});

socket.on('error', (message) => {
    console.error('Error: ',message);
    alert(message);
});

// Function to initialize game tables (you'll need to implement this)
function initializeGame() {
    // This function should handle the logic for displaying and populating your game tables
    console.log('Initializing game...');
    // Add your game table initialization code here
}