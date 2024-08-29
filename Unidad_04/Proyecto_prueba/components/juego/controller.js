const storage = require('./storage');

async function buscarOCrearPartida(jugadorId) {
    let partida = await storage.buscarPartidaDisponible();
    if (partida) {
        return await storage.unirseAPartida(partida._id, jugadorId);
    } else {
        return await storage.crearPartida(jugadorId);
    }
}

async function colocarBarcos(partidaId, jugadorId, barcos) {
    return await storage.colocarBarcos(partidaId, jugadorId, barcos);
}

async function realizarDisparo(partidaId, jugadorId, x, y) {
    const { partida, impacto } = await storage.realizarDisparo(partidaId, jugadorId, x, y);
    return { partida, impacto };
}

async function obtenerEstadoPartida(partidaId) {
    return await storage.obtenerPartida(partidaId);
}

module.exports = {
    buscarOCrearPartida,
    colocarBarcos,
    realizarDisparo,
    obtenerEstadoPartida
};