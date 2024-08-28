const { crearJuego, obtenerJuegoPorId, actualizarJuego } = require('./storage');

async function iniciarJuego(req, res) {
    const juego = await crearJuego(req.body.jugador1);
    res.status(201).json(juego);
}

async function hacerMovimiento(req, res) {
    const juego = await obtenerJuegoPorId(req.params.id);
    if (!juego) return res.status(404).json({ error: 'Juego no encontrado' });

    // Aquí iría la lógica para procesar el movimiento

    await actualizarJuego(req.params.id, { turno: nuevoTurno });
    res.json(juego);
}

module.exports = {
    iniciarJuego,
    hacerMovimiento,
};
