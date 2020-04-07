const express = require('express')
const user = require('./user')
const error = require('../middleware/errorHandle')

module.exports = (app) => {
  app.use('/public', express.static('public'))
  app.use('/users', user)
  app.use(error)
}
