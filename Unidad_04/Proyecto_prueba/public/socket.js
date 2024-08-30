const userController = require('../components/usuario/controller');
const juegoController = require('../components/juego/controller');

const registerHandler = (socket) => {
    socket.on('register', async (userData) => {
        console.log('Datos de registro recibidos:', userData);
        try {
            const newUser = await userController.addUsuario(userData);
            socket.emit('registerSuccess', { message: 'Usuario registrado con éxito', user: newUser });
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            socket.emit('registerError', { message: 'Error al registrar usuario' });
        }
    });
};

const loginHandler = (socket) => {
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
                socket.emit('loginSuccess', {
                    id: user._id,
                    nombre: user.nombre,
                    email: user.email,
                    apellido: user.apellido
                });
            } else {
                socket.emit('loginError', 'Contraseña incorrecta');
            }
        } catch (error) {
            console.error('Error en login en el servidor:', error);
            socket.emit('loginError', 'Error al iniciar sesión');
        }
    });
};

const initializeSocket = (socket) => {
    socket.on('connect', () => {
        console.log('jugador conectado');
    });


    socket.on('createGame', async (callback) => {
        try {
            const partida = await juegoController.crearJuego(socket.id);
            socket.join(partida._id.toString());
            callback({ success: true, gameId: partida._id.toString() });
        } catch (error) {
            callback({ success: false, message: 'Error al crear la partida' });
        }
    });


    socket.on('cancelSearch', ({ gameId }) => {
        console.log(`Cancelando búsqueda de partida para el juego: ${gameId}`);
        // Implementa lógica para cancelar la búsqueda, si es necesario
    });


    socket.on('buscarPartida', async (jugadorId) => {
        try {
            let partida = await juegoController.buscarJuego();
            if (partida) {
                partida = await juegoController.unirseAPartida(partida._id, jugadorId);
                socket.join(partida._id.toString());
                socket.to(partida._id.toString()).emit('iniciarColocacion', partida);
            } else {
                partida = await juegoController.crearJuego(jugadorId);
                socket.join(partida._id.toString());
                socket.emit('esperandoOponente', partida);
            }
        } catch (error) {
            socket.emit('error', 'Error al buscar o crear la partida');
        }
    });


    socket.on('colocarBarcos', async ({ partidaId, jugadorId, barcos }) => {
        try {
            const partida = await juegoController.colocarBarcos(partidaId, jugadorId, barcos);
            if (partida.barcosJugador1 && partida.barcosJugador2) {
                socket.to(partidaId).emit('iniciarJuego', partida);
            } else {
                socket.emit('esperandoOponente', partida);
            }
        } catch (error) {
            socket.emit('error', 'Error al colocar los barcos');
        }
    });



    socket.on('realizarDisparo', async ({ partidaId, jugadorId, x, y }) => {
        try {
            const { partida, impacto } = await juegoController.realizarDisparo(partidaId, jugadorId, x, y);
            socket.to(partidaId).emit('actualizarTablero', { partida, impacto, x, y });

            if (partida.estado === 'finalizada') {
                socket.to(partidaId).emit('finJuego', partida);
            }
        } catch (error) {
            socket.emit('error', 'Error al realizar el disparo');
        }
    });

    
    socket.on('disconnect', () => {
        console.log('jugador desconectado');
    });
};

module.exports = { registerHandler, loginHandler, initializeSocket };
