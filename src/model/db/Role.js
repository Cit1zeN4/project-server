const Sequelize = require('sequelize')
const db = require('../../db/database')

const Role = db.define('role', {
  roleName: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
})

module.exports = Role
