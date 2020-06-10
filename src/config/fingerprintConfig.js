const fingerprint = require('express-fingerprint')

module.exports = {
  parameters: [
    fingerprint.useragent,
    fingerprint.acceptHeaders,
    fingerprint.geoip,
  ],
}
