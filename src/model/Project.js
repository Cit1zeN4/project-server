const Sequelize = require('sequelize')
const db = require('../db/database')
const User = require('./User')
const File = require('./File')
const ProjectUser = require('./UserProject')
const Task = require('./Task')

const Project = db.define('project', {
  projectName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  projectDescription: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  projectBudget: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
})

Project.belongsTo(User, { as: 'manager' })

File.belongsToMany(Project, { through: 'project_files' })
Project.belongsToMany(File, { through: 'project_files' })

User.belongsToMany(Project, { through: ProjectUser })
Project.belongsToMany(User, { through: ProjectUser })

Task.belongsTo(Project)

module.exports = Project
