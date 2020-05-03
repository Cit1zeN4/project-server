const Sequelize = require('sequelize')
const db = require('../db/database')

const AdditionalContact = db.define('file', {
  fileName: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  fileType: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  filePath: {
    type: Sequelize.STRING,
    allowNull: false,
  },
})

module.exports = AdditionalContact
