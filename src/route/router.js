const express = require('express')
const api = require('./api')
const error = require('../middleware/errorHandle')

module.exports = (app) => {
  app.use('/public', express.static('public'))
  app.use('/api', api)
  app.use(error)
}
