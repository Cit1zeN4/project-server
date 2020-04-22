const express = require('express')
const bodyParser = require('body-parser')
const user = require('./private/user')
const files = require('./private/files')
const project = require('./private/project')
const task = require('./private/task')
const checkJwt = require('../middleware/checkJwt')
const error = require('../middleware/errorHandle')

module.exports = (app) => {
  app.use(bodyParser.urlencoded())
  app.use(bodyParser.json())
  app.use(bodyParser.raw())
  app.use('/public/files', express.static('public'))
  // Return user authentication 'checkJwt'
  app.use('/private/users', user)
  app.use('/private/files', files)
  app.use('/private/project', project)
  app.use('/private/task', task)
  app.use(error)
}
