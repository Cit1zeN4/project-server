const Sequelize = require('sequelize')
const db = require('../db/database')
const ContactType = require('./ContactType')

const AdditionalContact = db.define('additionalContact', {
  contactValue: {
    type: Sequelize.STRING,
    allowNull: false,
  },
})

AdditionalContact.belongsTo(ContactType)

module.exports = AdditionalContact
