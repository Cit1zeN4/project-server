const Sequelize = require('sequelize')
const db = require('../../db/database')
const User = require('./User')

// TODO: Add taskContentType

const Task = db.define('task', {
  taskName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  taskContent: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  StartDate: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },
  EndDate: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },
})

User.belongsToMany(Task, { through: 'task_user' })
Task.belongsToMany(User, { through: 'task_user' })

module.exports = Task
