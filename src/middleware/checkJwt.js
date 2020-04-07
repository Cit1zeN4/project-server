const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')

// Authentication middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
module.exports = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.DEV_API_JWKS_URI,
  }),

  // Validate the audience and the issuer.
  audience: process.env.DEV_API_IDENTIFIER,
  issuer: process.env.DEV_API_ISSUER,
  algorithms: ['RS256'],
})
