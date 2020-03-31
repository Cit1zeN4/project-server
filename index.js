const express = require('express')
const router = require('./src/route/router')
const db = require('./src/data/database')

const app = express()
const port = process.env.PORT || 3000

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

module.exports.app = app
module.exports.sequelize = db
