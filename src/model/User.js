const Sequelize = require('sequelize')
const db = require('../db/database')
const Role = require('./Role')

const User = db.define('user', {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  surname: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  middleName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  photoLink: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: `http://${process.env.HOST}:${process.env.PORT}/public/files/img/profile.png`,
  },
})

User.belongsTo(Role)

module.exports = User
