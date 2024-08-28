const Juego = require('./model');

async function crearJuego(jugador1) {
    const juego = new Juego({ jugador1 });
    return await juego.save();
}

async function obtenerJuegoPorId(id) {
    return await Juego.findById(id);
}

async function actualizarJuego(id, data) {
    return await Juego.findByIdAndUpdate(id, data, { new: true });
}

module.exports = {
    crearJuego,
    obtenerJuegoPorId,
    actualizarJuego,
};
