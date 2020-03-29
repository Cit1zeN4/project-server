const ApiKey = require('../model/ApiKey')

const apiKey = new ApiKey()

function apiKeyValidate(req, res, next) {
  const { key } = req.params
  apiKey.exist(key).then((result) => {
    if (result) next()
    else next(new Error(`API key: '${key}' doesn't exist`))
  })
}

module.exports = apiKeyValidate
