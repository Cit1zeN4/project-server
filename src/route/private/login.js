const express = require('express')
const Joi = require('@hapi/joi')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../../model/db/User')

const router = express.Router()
const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
})

router.post('/', async (req, res) => {
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
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)
    res.json({ message: 'Logged in', token })
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router
