const express = require('express')
const body_parser = require('body-parser')
const http = require("http")
const { Server: WebsocketServer } = require('socket.io');

const userController = require('./components/usuario/controller')
const config = require('./network/config')
const routes = require('./network/routes')
const db = require('./network/db')
const { registerHandler, loginHandler } = require('./public/socket');

var app = express()
const server = http.createServer(app);
const httpServer = server.listen( config.PORT )
const io = new WebsocketServer(httpServer)

db( config.DB_URL )

app.use( body_parser.json() )
app.use( body_parser.urlencoded({extended:false}) )

app.use('/', express.static('public'))

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado, ', socket.id);
    registerHandler(socket);
    loginHandler(socket);
    socket.on('disconnect', () => {
        console.log('Client desconectado, ', socket.id);
    });
    socket.on('buscarPartida', () => {
        if (waitingPlayer) {
            // Emparejar con el jugador en espera
            const game = {
                _id: generateGameId(),
                player1: waitingPlayer.id,
                player2: socket.id,
                playerBoardData: createEmptyBoard(),
                opponentBoardData: createEmptyBoard(),
                turn: waitingPlayer.id
            };
            io.to(waitingPlayer.id).emit('partidaEncontrada', game);
            io.to(socket.id).emit('partidaEncontrada', game);

            // Guardar el juego en alguna estructura o base de datos
            waitingPlayer = null; // Reiniciar el jugador en espera
        } else {
            waitingPlayer = socket;
            socket.emit('esperandoJugador');
        }
    });

    socket.on('realizarMovimiento', (data) => {
        const { juegoId, x, y } = data;
        // Obtener el juego usando juegoId
        const juego = getGameById(juegoId); // Implementa esta función

        // Verificar si es el turno del jugador
        if (socket.id === juego.turn) {
            const opponentBoard = juego.opponentBoardData;
            if (opponentBoard[y][x] === 'ship') {
                opponentBoard[y][x] = 'hit';
            } else {
                opponentBoard[y][x] = 'miss';
            }

            // Cambiar el turno al otro jugador
            juego.turn = (socket.id === juego.player1) ? juego.player2 : juego.player1;

            // Emitir la actualización del juego a ambos jugadores
            io.to(juego.player1).emit('actualizacionJuego', juego);
            io.to(juego.player2).emit('actualizacionJuego', juego);
        }
    });

    socket.on('disconnect', () => {
        console.log('Jugador desconectado:', socket.id);
        if (waitingPlayer && waitingPlayer.id === socket.id) {
            waitingPlayer = null; // Limpiar el jugador en espera si se desconecta
        }
    });
});
function createEmptyBoard() {
    return Array(10).fill().map(() => Array(10).fill(''));
}

function generateGameId() {
    return Math.random().toString(36).substr(2, 9); // Generar un ID simple para el juego
}

function getGameById(id) {
    // Implementa esta función para obtener el juego por ID
}
console.log(`La aplicacion se encuentra arriba en http://localhost:${config.PORT}`)

//npm i nodemon -D
//npm i -D nodemon @babel/core @babel/node @babel/preset-env 