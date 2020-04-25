const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const token = req.header('Access-token')
  if (!token) res.status(401).json({ message: 'Access denied' })
  try {
    const verify = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch (err) {
    res.status(400).json({ message: `Invalid token` })
  }
}
