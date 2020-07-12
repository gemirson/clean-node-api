const httpResponse = require('../helpers/http-response')

module.exports = class LoginRouter {
  router (httpRequest) {
    if (!httpRequest || !httpRequest.body) {
      return httpResponse.serverError()
    }
    const { email, password } = httpRequest.body
    if (!email) {
      return httpResponse.badRequest('email')
    }

    if (!password) {
      return httpResponse.badRequest('password')
    }
  }
}
