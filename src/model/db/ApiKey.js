const Sequelize = require('sequelize')
const db = require('../../db/database')

const ApiKeyModel = db.define(
  'apiKey',
  {
    key: {
      type: Sequelize.STRING(16),
      primaryKey: true,
    },
  },
  {
    timestamps: false,
  }
)

module.exports = ApiKeyModel
