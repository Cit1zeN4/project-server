const express = require('express')
const Role = require('../../model/Role')

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const roles = await Role.findAll()
    if (!roles)
      return res.status(400).json({ error: true, message: `Can't find roles` })
    return res.json(roles)
  } catch (err) {
    next(err)
  }
})

module.exports = router
