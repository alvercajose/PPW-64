const express = require('express');
const controller = require('./controller');
const router = express.Router();

router.post('/crear', async (req, res) => {
    try {
        const juego = await controller.crearJuego(req.body.jugadorId);
        res.status(201).json({ message: 'Juego creado con éxito', juego });
    } catch (error) {
        res.status(400).json({ message: 'Error al crear juego', error: error.message });
    }
});

router.post('/unirse/:juegoId', async (req, res) => {
    try {
        const juego = await controller.unirseAJuego(req.params.juegoId, req.body.jugadorId);
        res.json({ message: 'Unido al juego con éxito', juego });
    } catch (error) {
        res.status(400).json({ message: 'Error al unirse al juego', error: error.message });
    }
});

router.post('/movimiento', async (req, res) => {
    try {
        const { juegoId, jugadorId, x, y } = req.body;
        const juegoActualizado = await controller.realizarMovimiento(juegoId, jugadorId, x, y);
        res.json({ message: 'Movimiento realizado', juego: juegoActualizado });
    } catch (error) {
        res.status(400).json({ message: 'Error al realizar movimiento', error: error.message });
    }
});

router.get('/buscar', async (req, res) => {
    try {
        const juego = await controller.buscarPartida();
        res.json({ message: 'Partida encontrada o creada', juego });
    } catch (error) {
        res.status(500).json({ message: 'Error al buscar partida', error: error.message });
    }
});

module.exports = router;