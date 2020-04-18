const Sequelize = require('sequelize')
const db = require('../../db/database')
const ProjectRole = require('./ProjectRole')

const UserProject = db.define('user_project', {})

UserProject.belongsTo(ProjectRole)

module.exports = UserProject
