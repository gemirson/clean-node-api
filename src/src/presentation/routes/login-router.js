const httpResponse = require('../helpers/http-response')
const MissingParamError = require('../helpers/missing-param-error')
const InvalidParamError = require('../helpers/invalid-param-error copy')

module.exports = class LoginRouter {
  constructor (authUseCase, emailValidator) {
    this.authUseCase = authUseCase
    this.emailValidator = emailValidator
  }

  async router (httpRequest) {
    try {
      if (!httpRequest || !httpRequest.body || !this.authUseCase || !this.authUseCase.auth) {
        return httpResponse.serverError()
      }
      const { email, password } = httpRequest.body
      if (!email) {
        return httpResponse.badRequest(new MissingParamError('email'))
      }

      if (!this.emailValidator.isValid(email)) {
        return httpResponse.badRequest(new InvalidParamError('email'))
      }

      if (!password) {
        return httpResponse.badRequest(new MissingParamError('password'))
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
