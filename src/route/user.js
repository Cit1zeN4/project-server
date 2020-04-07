const express = require('express')
const user = require('../model/db/User')

const router = express.Router()

router.get('/', (req, res) => {
  user
    .findAll()
    .then((users) => {
      res.status(200).send(users)
    })
    .catch((err) => {
      res.status(500).send(err)
    })
})

module.exports = router
