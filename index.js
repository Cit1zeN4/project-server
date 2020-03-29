const express = require('express')
const Sequelize = require('sequelize')
const router = require('./src/route/router')

const app = express()
const port = process.env.PORT || 3000
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
})

router(app)

app.listen(port, () => {
  console.log(`Server start on port ${port} ...`)
})

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err)
  })

module.exports = app
