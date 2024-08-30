const express = require('express')
const body_parser = require('body-parser')
const http = require("http")
const { Server: WebsocketServer } = require('socket.io');

const config = require('./network/config')
const routes = require('./network/routes')
const db = require('./network/db')
const { registerHandler, loginHandler, initializeSocket} = require('./public/socket');

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
    initializeSocket(socket);
    socket.on('disconnect', () => {
        console.log('Client desconectado, ', socket.id);
    });
});

console.log(`La aplicacion se encuentra arriba en http://localhost:${config.PORT}`)

//npm i nodemon -D
//npm i -D nodemon @babel/core @babel/node @babel/preset-env 