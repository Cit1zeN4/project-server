const Sequelize = require('sequelize')
const db = require('../../db/database')

const ContactType = db.define(
  'contactType',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    contactTypeName: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
)

module.exports = ContactType
