
const socket = io(); 

socket.on('connect', () => {
    console.log('Conectado al servidor');
});

socket.on('connect_error', (error) => {
    console.error('Error de conexión:', error);
});