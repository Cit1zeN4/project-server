const express = require('express')
const apiKey = require('../middleware/apiKey')

const router = express.Router()

router.use('/:key', apiKey)

module.exports = router
