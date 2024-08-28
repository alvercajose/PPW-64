
const mongoose = require('mongoose')
const schema = mongoose.Schema

const req_string = {
    type: String,
    required: true
}

const req_date = {
    type: Date,
    required: true
}

const req_array = {
    type: Array,
    required: true,
    default: () => Array(10).fill().map(() => Array(10).fill(0)),
}

const juego_schema = new schema({
    player1: req_string,
    player2: String,
    board1: req_array,
    board2: req_array,
    turn: String,
}, {
    timestamps: { createdAt: 'fecha_creacion', updatedAt: 'fecha_actualizacion' }
})

const model = mongoose.model('juego', juego_schema)
module.exports = model
