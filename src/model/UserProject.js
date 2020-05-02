const Sequelize = require('sequelize')
const db = require('../db/database')

const UserProject = db.define('user_project', {
  role: {
    type: Sequelize.STRING,
    allowNull: true,
  },
})

module.exports = UserProject
