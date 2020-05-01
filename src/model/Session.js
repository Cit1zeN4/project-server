const Sequelize = require('sequelize')
const User = require('./User')
const db = require('../db/database')

const Session = db.define('jwt_session', {
  refreshToken: {
    type: Sequelize.UUID,
    allowNull: false,
  },
  expiresIn: {
    type: Sequelize.BIGINT,
    allowNull: false,
  },
  fingerprint: {
    type: Sequelize.STRING,
    allowNull: false,
  },
})

Session.belongsTo(User)

module.exports = Session
