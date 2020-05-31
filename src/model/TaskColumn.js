const Sequelize = require('sequelize')
const db = require('../db/database')
const Task = require('./Task')
const Project = require('./Project')

const TaskColumn = db.define('task_column', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
})

TaskColumn.hasMany(Task, { onDelete: 'CASCADE' })
Task.belongsTo(TaskColumn)

Project.hasMany(TaskColumn)
TaskColumn.belongsTo(Project)

module.exports = TaskColumn
