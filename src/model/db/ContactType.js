const Sequelize = require('sequelize')
const db = require('../../db/database')

const ContactType = db.define('contactType', {
  contactTypeName: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
})

module.exports = ContactType
