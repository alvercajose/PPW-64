const storage = require('./storage');
const bcrypt = require('bcrypt');

async function addUsuario(usuarioData) {
    const hashedPassword = await bcrypt.hash(usuarioData.clave, 10);
    usuarioData.clave = hashedPassword;
    usuarioData.fecha_registro = new Date();
    usuarioData.fecha_actualizacion = new Date();
    return await storage.add(usuarioData);
}

async function getUsuario(email) {
    return await storage.get(email);
}

async function updateUsuario(email, updateData) {
    if (updateData.clave) {
        updateData.clave = await bcrypt.hash(updateData.clave, 10);
    }
    updateData.fecha_actualizacion = new Date();
    return await storage.update(email, updateData);
}

async function deleteUsuario(email) {
    return await storage.delete(email);
}

async function autenticarUsuario(email, clave) {
    const usuario = await storage.get(email);
    if (usuario && await bcrypt.compare(clave, usuario.clave)) {
        return usuario;
    }
    return null;
}

module.exports = {
    addUsuario,
    getUsuario,
    updateUsuario,
    deleteUsuario,
    autenticarUsuario
};