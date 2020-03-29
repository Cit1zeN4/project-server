const express = require('express')
const router = require('./src/route/router')

const app = express()
const port = process.env.PORT || 3000

router(app)

app.listen(port, () => {
  console.log(`Server start on port ${port} ...`)
})

module.exports = app
