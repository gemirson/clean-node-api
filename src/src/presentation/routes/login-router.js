const HttpResponse = require('../helpers/http-response')
const { MissingParamError, InvalidParamError } = require('../../utils/erros')

module.exports = class LoginRouter {
  constructor (authUseCase, emailValidator) {
    this.authUseCase = authUseCase
    this.emailValidator = emailValidator
  }

  async router (HttpRequest) {
    try {
      if (!HttpRequest || !HttpRequest.body || !this.authUseCase || !this.authUseCase.auth) {
        return HttpResponse.serverError()
      }
      const { email, password } = HttpRequest.body
      if (!email) {
        return HttpResponse.badRequest(new MissingParamError('email'))
      }

      console.log(this.emailValidator.isValid(email))

      if (!this.emailValidator.isValid(email)) {
        return HttpResponse.badRequest(new InvalidParamError('email'))
      }

      if (!password) {
        return HttpResponse.badRequest(new MissingParamError('password'))
      }
      const acessToken = await this.authUseCase.auth(email, password)

      console.log(acessToken)

      if (!acessToken) {
        return HttpResponse.unauthorizedError()
      }

      return HttpResponse.ok({ acessToken })
    } catch (error) {
      console.log(error)
      return HttpResponse.serverError()
    }
  }
}
