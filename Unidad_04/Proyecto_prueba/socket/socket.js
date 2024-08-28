const usuario = require('../components/usuario/interface')
import Note from '../components/models/Note';
export default (io) => {
    io.on('connection', () => {
        const emitNotes = async()=> {
            const notes = await Note.find()
            io.emit('loadnotes', notes)
        }
        emitNotes()
    })
}