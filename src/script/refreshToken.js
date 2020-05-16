const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const Session = require('../model/Session')

module.exports = async (req, res, next, data) => {
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
        .cookie('refreshToken', newRefreshToken, {
          maxAge: process.env.SESSION_MAX_AGE,
          httpOnly: true,
          // path: '/api/auth/',
        })
        .cookie('accessToken', token, {
          maxAge: 900000,
          httpOnly: true,
          // path: '/api',
        })
        .json(data)
    }
  } catch (err) {
    next(err)
  }
}
