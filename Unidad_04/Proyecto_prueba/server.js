const express = require('express')
const body_parser = require('body-parser')
const http = require("http")
const { Server: WebsocketServer } = require('socket.io');

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
    console.log('Nuevo cliente conectado, ', socket.id);
    socket.on('disconnect', () => {
        console.log('Client desconectado, ', socket.id);
    });
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
    socket.on('login', async ({ email, password }) => {
        try {
            console.log('Datos de login recibidos en el servidor:', { email, password });
            const user = await userController.getUsuario(email);
            if (!user) {
                socket.emit('loginError', 'Usuario no encontrado');
                return;
            } 

            const isPasswordValid = password === user.clave;
            console.log('Contraseña válida:', isPasswordValid);
            
            if (isPasswordValid) {
                // Contraseña correcta
                socket.emit('loginSuccess', {
                    id: user._id,
                    nombre: user.nombre,
                    email: user.email,
                    apellido: user.apellido
                    // Añade otros campos si es necesario
                });
            } else {
                // Contraseña incorrecta
                socket.emit('loginError', 'Contraseña incorrecta');
            }
        } catch (error) {
            console.error('Error en login en el servidor:', error);
            socket.emit('loginError', 'Error al iniciar sesión');
        }
    })
});
console.log(`La aplicacion se encuentra arriba en http://localhost:${config.PORT}`)

//npm i nodemon -D
//npm i -D nodemon @babel/core @babel/node @babel/preset-env 