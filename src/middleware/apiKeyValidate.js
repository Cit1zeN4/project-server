const apiKey = require('../model/ApiKey')

function apiKeyValidate(req, res, next) {
  const { key } = req.params
  apiKey.count({ where: { key } }).then((count) => {
    if (count !== 0) next()
    else next(new Error(`key: '${key}' doesn't exist`))
  })
}

module.exports = apiKeyValidate
