const mongoose = require('mongoose');

const barcoSchema = new mongoose.Schema({
    tipo: String,
    posiciones: [[Number]],
    hundido: { type: Boolean, default: false }
});

const partidaSchema = new mongoose.Schema({
    jugador1: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    jugador2: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    estado: { type: String, enum: ['esperando', 'colocando', 'en_curso', 'finalizada'], default: 'esperando' },
    turnoActual: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    barcosJugador1: [barcoSchema],
    barcosJugador2: [barcoSchema],
    disparosJugador1: [[Number]],
    disparosJugador2: [[Number]],
    ganador: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    fechaInicio: { type: Date, default: Date.now },
    fechaFin: Date
});

module.exports = mongoose.model('Partida', partidaSchema);