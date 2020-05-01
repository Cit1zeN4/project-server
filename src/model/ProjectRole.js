const Sequelize = require('sequelize')
const db = require('../db/database')

const ProjectRole = db.define('project_role', {
  roleName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
})

module.exports = ProjectRole
