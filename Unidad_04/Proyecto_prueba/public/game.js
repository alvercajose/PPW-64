class BattleshipGame {
    constructor() {
        this.partidaId = null;
        this.jugadorId = null;
        this.estadoJuego = 'esperando'; // esperando, preparando, jugando, terminado
        this.setupSocketListeners();
    }

    setupSocketListeners() {
        socket.on('partidaCreada', (data) => {
            this.partidaId = data.partidaId;
            this.actualizarEstadoJuego('Partida creada. Código: ' + this.partidaId);
        });

        socket.on('jugadorUnido', (data) => {
            this.actualizarEstadoJuego('Jugador unido. Preparando el juego...');
        });

        socket.on('iniciarColocacion', () => {
            this.estadoJuego = 'preparando';
            this.actualizarEstadoJuego('Coloca tus barcos');
            this.mostrarInterfazColocacion();
        });

        socket.on('partidaIniciada', () => {
            this.estadoJuego = 'jugando';
            this.actualizarEstadoJuego('¡La partida ha comenzado!');
            this.ocultarInterfazColocacion();
        });

        socket.on('turnoJugador', (esmiTurno) => {
            if (esmiTurno) {
                this.actualizarEstadoJuego('Es tu turno');
            } else {
                this.actualizarEstadoJuego('Turno del oponente');
            }
        });

        socket.on('resultadoDisparo', (data) => {
            this.actualizarTablero(data.x, data.y, data.resultado);
        });

        socket.on('finPartida', (data) => {
            this.estadoJuego = 'terminado';
            this.actualizarEstadoJuego(data.ganador === this.jugadorId ? '¡Has ganado!' : 'Has perdido');
        });
    }

    crearPartida(jugadorId) {
        this.jugadorId = jugadorId;
        socket.emit('crearPartida', { jugadorId });
    }

    unirseAPartida(jugadorId, codigoPartida) {
        this.jugadorId = jugadorId;
        socket.emit('unirseAPartida', { jugadorId, codigoPartida });
    }

    colocarBarcos(barcos) {
        if (this.estadoJuego !== 'preparando') {
            throw new Error('No es el momento de colocar barcos');
        }
        socket.emit('colocarBarcos', { partidaId: this.partidaId, jugadorId: this.jugadorId, barcos });
    }

    realizarDisparo(x, y) {
        if (this.estadoJuego !== 'jugando') {
            throw new Error('No es el momento de realizar disparos');
        }
        socket.emit('realizarDisparo', { partidaId: this.partidaId, jugadorId: this.jugadorId, x, y });
    }

    actualizarEstadoJuego(mensaje) {
        document.getElementById('game-status').textContent = mensaje;
    }

    mostrarInterfazColocacion() {
        document.getElementById('ship-placement').style.display = 'block';
    }

    ocultarInterfazColocacion() {
        document.getElementById('ship-placement').style.display = 'none';
    }

    actualizarTablero(x, y, resultado) {
        // Implementar la lógica para actualizar el tablero en la interfaz
        console.log(`Disparo en (${x}, ${y}): ${resultado}`);
    }
}

// Inicialización y manejo de eventos de la interfaz
document.addEventListener('DOMContentLoaded', () => {
    const game = new BattleshipGame();

    document.getElementById('create-game').addEventListener('click', () => {
        const jugadorId = /* obtener id del jugador autenticado */;
        game.crearPartida(jugadorId);
    });

    document.getElementById('join-game-btn').addEventListener('click', () => {
        const jugadorId = /* obtener id del jugador autenticado */;
        const codigoPartida = document.getElementById('game-code').value;
        game.unirseAPartida(jugadorId, codigoPartida);
    });

    document.getElementById('place-ship').addEventListener('click', () => {
        const shipType = document.getElementById('ship-type').value;
        // Lógica para colocar el barco en el tablero
        // Cuando todos los barcos estén colocados:
        // game.colocarBarcos(barcos);
    });

    document.getElementById('opponent-board').addEventListener('click', (e) => {
        if (game.estadoJuego === 'jugando') {
            const x = /* calcular x basado en el clic */;
            const y = /* calcular y basado en el clic */;
            game.realizarDisparo(x, y);
        }
    });
});
