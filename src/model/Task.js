const Sequelize = require('sequelize')
const db = require('../db/database')
const User = require('./User')

// TODO: Add taskContentType

const Task = db.define('task', {
  taskName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  taskContent: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  startDate: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },
  endDate: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },
  sprint: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
})

Task.belongsTo(User, { as: 'owner' })

Task.belongsTo(User, { as: 'user' })
User.hasMany(Task)

module.exports = Task
