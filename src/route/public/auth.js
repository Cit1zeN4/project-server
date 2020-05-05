const express = require('express')
const Joi = require('@hapi/joi')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')
const User = require('../../model/User')
const Session = require('../../model/Session')

const router = express.Router()
const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
})

// POST api/auth/login

router.post('/login', async (req, res) => {
  try {
    const validate = schema.validate(req.body)

    // Validating data
    if (validate.error)
      res.status(400).json({ message: validate.error.message })

    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    })

    // User authentication
    if (user === null)
      res.status(400).json({ message: `Incorrect email or password` })

    const compare = bcrypt.compareSync(req.body.password, user.password)

    if (!compare)
      res.status(400).json({ message: `Incorrect email or password` })

    // Creating JWT
    const payload = { id: user.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '15m',
    })

    // Deleting all user session records if their number is greater
    // than set in SESSION_MAX_COUNT.
    const sessionCount = await Session.count({ where: { userId: user.id } })
    if (sessionCount >= process.env.SESSION_MAX_COUNT) {
      Session.destroy({ where: { userId: user.id } })
    }

    // Creating a session end date
    // SESSION_MAX_AGE - the maximum duration of the session
    // For example 5184000000 - 2 months in milliseconds
    const sessionExp = Date.now() + Number(process.env.SESSION_MAX_AGE)
    const refreshToken = uuidv4()

    await Session.create({
      userId: user.id,
      expiresIn: sessionExp,
      fingerprint: 'fingerprint',
      refreshToken,
    })

    res
      .cookie('refreshToken', refreshToken, {
        maxAge: process.env.SESSION_MAX_AGE,
        httpOnly: true,
        path: '/api/auth/',
      })
      .cookie('accessToken', token, {
        maxAge: 900000,
        httpOnly: true,
        path: '/api/',
      })
      .json({ message: 'Logged in' })
  } catch (err) {
    res.status(500).json(err.message)
  }
})

router.post('/refresh-tokens', async (req, res) => {
  try {
    const { fingerprint } = req.body
    if (!fingerprint)
      res.status(400).json({ error: true, message: `No fingerprint provided` })

    const { refreshToken } = req.cookies
    if (!refreshToken)
      res
        .status(400)
        .json({ error: true, message: `No refresh token provided` })

    const session = await Session.findOne({
      where: {
        refreshToken: refreshToken,
      },
    })

    if (!session)
      res.status(400).json({ error: true, message: `Can't find session` })
    else {
      await session.destroy()

      if (session.fingerprint !== fingerprint)
        res.status(400).json({ error: true, message: `Incorrect finger print` })

      if (session.expiresIn < Date.now())
        res.status(400).json({ error: true, message: `Refresh token expired` })

      // Creating a session end date
      // SESSION_MAX_AGE - the maximum duration of the session
      // For example 5184000000 - 2 months in milliseconds
      const sessionExp = Date.now() + Number(process.env.SESSION_MAX_AGE)
      const newRefreshToken = uuidv4()

      await Session.create({
        userId: session.userId,
        expiresIn: sessionExp,
        fingerprint: 'fingerprint',
        refreshToken: newRefreshToken,
      })

      // Creating JWT
      const payload = { id: session.userId }
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '15m',
      })

      res
        .cookie('refreshToken', refreshToken, {
          maxAge: process.env.SESSION_MAX_AGE,
          httpOnly: true,
          path: '/api/auth/',
        })
        .json({ message: 'Token was successfully refreshed', token })
    }
  } catch (err) {
    res.status(500).json({ error: true, message: err.message })
  }
})

module.exports = router
