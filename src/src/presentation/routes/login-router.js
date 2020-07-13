const httpResponse = require('../helpers/http-response')

module.exports = class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  async router (httpRequest) {
    try {
      if (!httpRequest || !httpRequest.body || !this.authUseCase || !this.authUseCase.auth) {
        return httpResponse.serverError()
      }
      const { email, password } = httpRequest.body
      if (!email) {
        return httpResponse.badRequest('email')
      }

      if (!password) {
        return httpResponse.badRequest('password')
      }
      const acessToken = await this.authUseCase.auth(email, password)

      if (!acessToken) {
        return httpResponse.unauthorizedError()
      }

      return httpResponse.ok({ acessToken })
    } catch (error) {
      return httpResponse.serverError()
    }
  }
}
