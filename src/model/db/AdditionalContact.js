const Sequelize = require('sequelize')
const db = require('../../db/database')
const ContactType = require('./ContactType')

const AdditionalContact = db.define(
  'additionalContact',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    contactValue: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
)

ContactType.hasOne(AdditionalContact)
AdditionalContact.belongsTo(ContactType)

module.exports = AdditionalContact
