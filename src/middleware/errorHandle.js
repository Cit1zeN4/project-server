function errorHandle(err, req, res, next) {
  console.log(err)
  res.status(500).send(err.message)
  next()
}

module.exports = errorHandle
