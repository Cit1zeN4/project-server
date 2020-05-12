const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')
const Validator = require('../../model/Validator')
const User = require('../../model/User')
const Session = require('../../model/Session')

const router = express.Router()

// POST api/auth/signup

router.post('/signup', async (req, res) => {
  try {
    const validate = Validator.signup().validate(req.body)

    // Validating data
    if (validate.error)
      res.status(400).json({ error: true, message: validate.error.message })

    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    })

    if (user)
      res.status(400).json({
        error: true,
        message: `User with email : ${req.body.email} already exist`,
      })

    // Password hashing
    const slat = bcrypt.genSaltSync()
    const hash = bcrypt.hashSync(req.body.password, slat)

    const newUser = await User.create({
      firstName: req.body.firstName,
      surname: req.body.surname,
      email: req.body.email,
      password: hash,
      roleId: 1,
    })

    // Creating JWT
    const payload = { id: newUser.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '15m',
    })

    // Creating a session end date
    // SESSION_MAX_AGE - the maximum duration of the session
    // For example 5184000000 - 2 months in milliseconds
    const sessionExp = Date.now() + Number(process.env.SESSION_MAX_AGE)
    const refreshToken = uuidv4()

    // TODO: Add fingerprint
    await Session.create({
      userId: newUser.id,
      expiresIn: sessionExp,
      fingerprint: req.fingerprint.hash,
      refreshToken,
    })

    res
      .cookie('refreshToken', refreshToken, {
        maxAge: process.env.SESSION_MAX_AGE,
        httpOnly: true,
        path: '/api/auth/',
      })
      // maxAge: 900000 - 15 minute
      .cookie('accessToken', token, {
        maxAge: 900000,
        httpOnly: true,
        path: '/api',
      })
      .json({
        message: 'Signed Up',
        refreshTokenExpireIn: Number(process.env.SESSION_MAX_AGE) + Date.now(),
        accessTokenExpireIn: 900000 + Date.now(),
        user: {
          firstName: newUser.firstName,
          surname: newUser.surname,
          email: newUser.email,
        },
      })
  } catch (err) {
    res.status(500).json({ error: true, message: err.message })
  }
})

// POST api/auth/login

router.post('/login', async (req, res) => {
  try {
    const validate = Validator.login().validate(req.body)

    // Validating data
    if (validate.error)
      res.status(400).json({ error: true, message: validate.error.message })

    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    })

    // User authentication
    if (!user)
      res
        .status(400)
        .json({ error: true, message: `Incorrect email or password` })

    const compare = bcrypt.compareSync(req.body.password, user.password)

    if (!compare)
      res
        .status(400)
        .json({ error: true, message: `Incorrect email or password` })

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

    // TODO: Add fingerprint
    await Session.create({
      userId: user.id,
      expiresIn: sessionExp,
      fingerprint: req.fingerprint.hash,
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
        path: '/api',
      })
      .json({
        message: 'Logged in',
        refreshTokenExpireIn: Number(process.env.SESSION_MAX_AGE) + Date.now(),
        accessTokenExpireIn: 900000 + Date.now(),
        user: {
          id: user.id,
          firstName: user.firstName,
          surname: user.surname,
          middleName: user.middleName,
          email: user.email,
          photoLink: user.photoLink,
        },
      })
  } catch (err) {
    res.status(500).json({ error: true, message: err.message })
  }
})

router.post('/refresh-tokens', async (req, res) => {
  try {
    const fingerprint = req.fingerprint.hash
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
        fingerprint: fingerprint,
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
        .cookie('accessToken', token, {
          maxAge: 900000,
          httpOnly: true,
          path: '/api',
        })
        .json({ message: 'Token was successfully refreshed' })
    }
  } catch (err) {
    res.status(500).json({ error: true, message: err.message })
  }
})

router.post('/', async (req, res) => {
  const { refreshToken, accessToken } = req.cookies

  if (!accessToken && !refreshToken)
    res.status(400).json({ error: true, message: `No tokens provided` })

  jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      Session.findOne({
        where: {
          refreshToken: refreshToken,
        },
      }).then((session) => {
        if (!session)
          res
            .status(400)
            .json({ error: true, message: `User wasn't authenticated` })

        res.json({ message: `User was authenticated` })
      })
    } else {
      res.json({ message: `User was authenticated`, payload: decoded })
    }
  })
})

module.exports = router
