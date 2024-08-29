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