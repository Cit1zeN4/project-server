const express = require('express')
const Joi = require('@hapi/joi')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const hash = require('object-hash')
const User = require('../../model/User')

const router = express.Router()
const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
})

// POST api/auth/login

router.post('/login', async (req, res) => {
  try {
    const validate = schema.validate(req.body)

    if (validate.error)
      res.status(400).json({ message: validate.error.message })

    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    })

    if (user === null)
      res.status(400).json({ message: `Incorrect email or password` })

    const compare = bcrypt.compareSync(req.body.password, user.password)

    if (!compare)
      res.status(400).json({ message: `Incorrect email or password` })

    // Creating JWT
    // TODO: Change context to browser fingerprint
    const context = hash.sha1(req.useragent)
    const payload = { id: user.id, context }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '15m',
    })

    res.json({ message: 'Logged in', token })
  } catch (err) {
    res.status(500).json(err.message)
  }
})

module.exports = router
