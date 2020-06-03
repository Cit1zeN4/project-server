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
  dueDate: {
    type: Sequelize.DATE,
    allowNull: true,
  },
})

Project.belongsTo(User, { as: 'manager' })

File.belongsToMany(Project, { through: 'project_files', onDelete: 'CASCADE' })
Project.belongsToMany(File, { through: 'project_files' })

User.belongsToMany(Project, { through: ProjectUser })
Project.belongsToMany(User, { through: ProjectUser })

module.exports = Project
