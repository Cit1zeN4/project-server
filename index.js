const express = require('express')
const router = require('./src/route/router')
const db = require('./src/db/database')
// Import all models to the cache before the database is synced.
require('./src/model/db/importModels')

const app = express()
const port = process.env.PORT || 3000
process.env.SERVER_DIR = __dirname

router(app)

app.listen(port, () => {
  console.log(`Server start on port ${port} ...`)
})

db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err)
  })

db.sync()
  .then(() => {
    console.log('database was successfully synced')
  })
  .catch((err) => {
    console.log('- error \n', err)
  })
