const express = require('express')
const bodyParser = require('body-parser')
const user = require('./private/user')
const checkJwt = require('../middleware/checkJwt')
const error = require('../middleware/errorHandle')

module.exports = (app) => {
  app.use(bodyParser.urlencoded())
  app.use(bodyParser.json())
  app.use('/public/files', express.static('public'))
  app.use('/private/users', checkJwt, user)
  app.use(error)
}
