const Joi = require('@hapi/joi')

module.exports = class Validator {
  static login() {
    return Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    })
  }

  static signup() {
    return Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      firstName: Joi.string().required(),
      surname: Joi.string().required(),
    })
  }
}
