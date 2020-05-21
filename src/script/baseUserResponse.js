const rolesConfig = require('../config/rolesConfig')

function userHandler(user) {
  return {
    id: user.id,
    firstName: user.firstName,
    surname: user.surname,
    middleName: user.middleName,
    email: user.email,
    photoLink: user.photoLink,
    role: rolesConfig.find((role) => role.id === user.roleId).name,
  }
}

module.exports.response = (res, token, message, user) => {
  res
    .cookie('refreshToken', token.refresh, {
      maxAge: process.env.SESSION_MAX_AGE,
      httpOnly: true,
      path: '/api/auth/',
    })
    // maxAge: 900000 - 15 minute
    .cookie('accessToken', token.access, {
      maxAge: 900000,
      httpOnly: true,
      path: '/api',
    })
    .json({
      message,
      refreshTokenExpireIn: Number(process.env.SESSION_MAX_AGE) + Date.now(),
      accessTokenExpireIn: 900000 + Date.now(),
      user: userHandler(user),
    })
}

module.exports.userHandler = (user) => userHandler(user)
