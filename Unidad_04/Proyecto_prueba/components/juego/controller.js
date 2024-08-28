const storage = require('./storage');

async function crearJuego(jugador1Id) {
    return await storage.crear({ jugador1: jugador1Id });
}

async function unirseAJuego(juegoId, jugador2Id) {
    const actualizacion = {
        jugador2: jugador2Id,
        estado: 'en_progreso',
        turno: jugador2Id
    };
    return await storage.actualizar(juegoId, actualizacion);
}

async function realizarMovimiento(juegoId, jugadorId, x, y) {
    const juego = await storage.obtener(juegoId);
    if (!juego || juego.estado !== 'en_progreso' || !juego.turno.equals(jugadorId)) {
        throw new Error('Movimiento no válido');
    }

    // Aquí iría la lógica para procesar el movimiento
    // Por ejemplo, actualizar el tablero, verificar impactos, etc.

    // Cambiar el turno
    const nuevoTurno = juego.turno.equals(juego.jugador1) ? juego.jugador2 : juego.jugador1;
    
    return await storage.actualizar(juegoId, { turno: nuevoTurno });
}

async function buscarPartida() {
    let juego = await storage.buscarDisponible();
    if (!juego) {
        // Si no hay juegos disponibles, crear uno nuevo
        juego = await crearJuego();
    }
    return juego;
}

module.exports = {
    crearJuego,
    unirseAJuego,
    realizarMovimiento,
    buscarPartida
};