const Juego = require('./model');

async function crearJuego(datosJuego) {
    const juego = new Juego(datosJuego);
    return await juego.save();
}

async function obtenerJuego(juegoId) {
    return await Juego.findById(juegoId).populate('jugador1 jugador2');
}

async function actualizarJuego(juegoId, actualizacion) {
    return await Juego.findByIdAndUpdate(juegoId, actualizacion, { new: true });
}

async function buscarJuegoDisponible() {
    return await Juego.findOne({ estado: 'esperando' });
}

module.exports = {
    crear: crearJuego,
    obtener: obtenerJuego,
    actualizar: actualizarJuego,
    buscarDisponible: buscarJuegoDisponible
};