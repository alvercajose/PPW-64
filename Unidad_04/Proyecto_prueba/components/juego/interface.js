const express = require('express');
const controller = require('./controller');
const router = express.Router();

router.post('/buscar', async (req, res) => {
    try {
        const partida = await controller.buscarOCrearPartida(req.body.jugadorId);
        res.status(200).json(partida);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/disparo', async (req, res) => {
    try {
        const { partidaId, jugadorId, x, y } = req.body;
        const partida = await controller.realizarDisparo(partidaId, jugadorId, x, y);
        res.status(200).json(partida);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Más rutas según sea necesario...

module.exports = router;