const express = require('express')
const apiKeyValidate = require('../middleware/apiKeyValidate')

const router = express.Router()

router.use('/:key', apiKeyValidate)

module.exports = router
