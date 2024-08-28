
const express = require('express')
const body_parser = require('body-parser')
const http = require("http")
import { Server as WebsocketServer} from "socket.io"
const socketIo = require('socket.io');

//import sockets from './network/sockets'
const sockets = require('./public/socket')
const usuarioactivo = require('./public/main')
const userController = require('./components/usuario/controller')
const config = require('./network/config')
const routes = require('./network/routes')
const db = require('./network/db')


var app = express()
const server = http.createServer(app);
const httpServer = server.listen( config.PORT )
const io = new WebsocketServer(httpServer)

db( config.DB_URL )

app.use( body_parser.json() )
app.use( body_parser.urlencoded({extended:false}) )

app.use('/', express.static('public'))

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('register', async (userData) => {
        console.log('Datos de registro recibidos:', userData);
        try {
            // Aquí va tu lógica para guardar el usuario en la base de datos
            const newUser = await userController.addUsuario(userData);
            socket.emit('registerSuccess', { message: 'Usuario registrado con éxito', user: newUser });
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            socket.emit('registerError', { message: 'Error al registrar usuario' });
        }
    });
});
console.log(`La aplicacion se encuentra arriba en http://localhost:${config.PORT}`)

//npm i nodemon -D
//npm i -D nodemon @babel/core @babel/node @babel/preset-env 