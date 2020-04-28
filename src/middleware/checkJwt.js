const jwt = require('jsonwebtoken')
const hash = require('object-hash')

module.exports = (req, res, next) => {
  const token = req.header('Access-token')

  if (!token) res.status(401).json({ message: 'Access denied' })

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) res.status(400).json({ message: `Invalid token` })
    if (decoded.context !== hash.sha1(req.useragent))
      res.status(400).json({ message: `Invalid context` })
    next()
  })
}
