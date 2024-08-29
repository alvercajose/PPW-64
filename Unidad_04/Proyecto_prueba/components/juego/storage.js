const Juego = require('./model');

async function crearPartida(jugador1Id) {
    const nuevaPartida = new Partida({
        jugador1: jugador1Id,
        disparosJugador1: Array(10).fill().map(() => Array(10).fill(0)),
        disparosJugador2: Array(10).fill().map(() => Array(10).fill(0))
    });
    return await nuevaPartida.save();
}

async function buscarPartidaDisponible() {
    return await Partida.findOne({ estado: 'esperando' });
}

async function unirseAPartida(partidaId, jugador2Id) {
    return await Partida.findByIdAndUpdate(partidaId, 
        { jugador2: jugador2Id, estado: 'colocando' },
        { new: true }
    );
}

async function colocarBarcos(partidaId, jugadorId, barcos) {
    const campoBarcos = jugadorId === partida.jugador1 ? 'barcosJugador1' : 'barcosJugador2';
    return await Partida.findByIdAndUpdate(partidaId, 
        { [campoBarcos]: barcos },
        { new: true }
    );
}

async function realizarDisparo(partidaId, jugadorId, x, y) {
    const partida = await Partida.findById(partidaId);
    const campoDisparos = jugadorId === partida.jugador1.toString() ? 'disparosJugador1' : 'disparosJugador2';
    const campoBarcos = jugadorId === partida.jugador1.toString() ? 'barcosJugador2' : 'barcosJugador1';
    
    partida[campoDisparos][y][x] = 1;
    
    // Verificar si el disparo impactó en un barco
    let impacto = false;
    partida[campoBarcos].forEach(barco => {
        barco.posiciones.forEach(pos => {
            if (pos[0] === x && pos[1] === y) {
                impacto = true;
                pos[2] = 1; // Marcar como impactado
            }
        });
        // Verificar si el barco está hundido
        if (barco.posiciones.every(pos => pos[2] === 1)) {
            barco.hundido = true;
        }
    });

    // Cambiar turno
    partida.turnoActual = partida.turnoActual.equals(partida.jugador1) ? partida.jugador2 : partida.jugador1;

    // Verificar si hay un ganador
    if (partida[campoBarcos].every(barco => barco.hundido)) {
        partida.estado = 'finalizada';
        partida.ganador = jugadorId;
        partida.fechaFin = new Date();
    }

    await partida.save();
    return { partida, impacto };
}

module.exports = {
    crearPartida,
    buscarPartidaDisponible,
    unirseAPartida,
    colocarBarcos,
    realizarDisparo
};