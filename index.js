const express = require('express')

const app = express()
const port = process.env.PORT || 300

app.listen(port, () => {
  console.log(`Server start on port ${port} ...`)
})
