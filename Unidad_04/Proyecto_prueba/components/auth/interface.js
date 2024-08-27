const jwt = requires()
const express = require('express')
const response = require('../../network/response')
const controller = require('./controller')

import {} from '../../middlewares'

const route = express.Router()

route.post('/signup', function(req, res) {
    controller.signup( req.body )
        .then( (data) => response.success(req, res, data, 200) )
        .catch( (error) => response.error(req, res, error, 500) )
})

route.post('/signin', function(req, res) {
    controller.signin( req.body )
        .then( (data) => response.success(req, res, data, 201) )
        .catch( (error) => response.error(req, res, error, 500) )
})

module.exports = route