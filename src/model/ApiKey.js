const Sequelize = require('sequelize')
const db = require('../data/database')

const ApiKeyModel = db.define('apiKey', {
  key: {
    type: Sequelize.STRING(16),
    primaryKey: true,
  },
})

module.exports = ApiKeyModel
