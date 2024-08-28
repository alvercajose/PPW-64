const mongoose = require('mongoose');

const juegoSchema = new mongoose.Schema({
    jugador1: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario', 
        required: true 
    },
    jugador2: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario' 
    },
    estado: { 
        type: String, 
        enum: ['esperando', 'en_progreso', 'terminado'], 
        default: 'esperando' 
    },
    tableroJugador1: [[String]],
    tableroJugador2: [[String]],
    turno: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario' 
    },
    ganador: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Juego', juegoSchema);