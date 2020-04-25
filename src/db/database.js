const Sequelize = require('sequelize')
require('dotenv').config()

const devDB = {
  dialect: process.env.DEV_DB_DIALECT,
  host: process.env.DEV_DB_HOST,
  port: process.env.DEV_DB_PORT,
  username: process.env.DEV_DB_USER,
  password: process.env.DEV_DB_PASS,
  database: process.env.DEV_DB_NAME,
  define: {
    timestamps: false,
  },
}

module.exports = new Sequelize(devDB)
