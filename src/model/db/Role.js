const Sequelize = require('sequelize')
const db = require('../../db/database')

const Role = db.define(
  'role',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    roleName: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: false,
  }
)

module.exports = Role
