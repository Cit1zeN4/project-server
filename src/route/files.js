const express = require('express')

const router = express.Router()

router.get('/files/', (req, res) => {
  res.send('he')
})

module.exports = router
