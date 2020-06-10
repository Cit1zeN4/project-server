module.exports = (roles) => {
  if (!Array.isArray(roles))
    throw new Error('Parameter roles must be an array of strings')

  return (req, res, next) => {
    console.log(req.decoded)
    if (!roles.some((r) => req.decoded.role === r))
      return res
        .status(423)
        .json({ error: 'PermissionError', message: 'insufficient permissions' })

    next()
  }
}
