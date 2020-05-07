const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.header('Access-token') ||
    req.cookies.accessToken
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err)
        return res.status(400).json({ error: true, message: err.message })
      req.decoded = decoded
      next()
    })
  } else {
    return res.status(401).json({ error: true, message: 'No token provided' })
  }
}
