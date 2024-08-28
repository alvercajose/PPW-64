
const express = require('express')
const body_parser = require('body-parser')
const http = require("http")
import { Server as WebsocketServer} from "socket.io"
const socketIo = require('socket.io');

import sockets from './socket/socket'
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

console.log(`La aplicacion se encuentra arriba en http://localhost:${config.PORT}`)

sockets(io)
//npm i nodemon -D
//npm i -D nodemon @babel/core @babel/node @babel/preset-env 