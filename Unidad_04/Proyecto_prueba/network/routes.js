
const usuario = require('../components/usuario/interface')
const ciudad = require('../components/ciudad/interface')


const routes = function( server ) {
    server.use('/usuario', usuario)
    server.use('/ciudad', ciudad)
}

module.exports = routes
