const api = require('./api')
const error = require('../middleware/errorHandle')

module.exports = (app) => {
  app.use('/api', api)
  app.use(error)
}
