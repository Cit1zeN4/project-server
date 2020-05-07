const express = require('express')
const router = require('./src/route/router')
const db = require('./src/db/database')
const { roleDefault } = require('./src/db/dbDefault')
require('dotenv').config()
// Import all models to the cache before the database is synced.
require('./src/model/importModels')

const app = express()
const port = process.env.PORT || 3000
process.env.SERVER_DIR = __dirname

// Сonnects all the routes
router(app)

app.listen(port, () => {
  console.log(`Server start on port ${port} ...`)

  db.authenticate()
    .then(() => {
      console.log('Connection has been established successfully.')
      db.sync({ logging: false })
        .then(() => {
          console.log('database was successfully synced')
          // Adding default Roles
          roleDefault()
        })
        .catch((err) => {
          console.log('- error \n', err)
        })
    })
    .catch((err) => {
      console.error('Unable to connect to the database:', err)
    })
})
