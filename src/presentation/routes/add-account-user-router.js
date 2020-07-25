const { MissingParamError, InvalidParamError } = require('../../utils/erros')
const HttpResponse = require('../helpers/http-response')

module.exports = class AddAccountRoute {
  constructor ({ addAccountUseCase, passwordValidator, emailValidator } = {}) {
    this.addAccountUseCase = addAccountUseCase
    this.passwordValidator = passwordValidator
    this.emailValidator = emailValidator
  }

  async route (httpRequest) {
    try {
      if (!httpRequest || !httpRequest.body || !this.addAccountUseCase) {
        return HttpResponse.serverError()
      }
      const { email, password, name } = httpRequest.body
      if (!email) {
        return HttpResponse.badRequest(new MissingParamError('email'))
      }
      if (!password) {
        return HttpResponse.badRequest(new MissingParamError('password'))
      }
      if (!name) {
        return HttpResponse.badRequest(new MissingParamError('name'))
      }
      const isValidEmail = await this.emailValidator.isValid(email)
      const isValidPassword = await this.passwordValidator.isValid(password)
      if (!isValidEmail) {
        return HttpResponse.badRequest(new InvalidParamError('email'))
      }
      if (!isValidPassword) {
        return HttpResponse.badRequest(new InvalidParamError('password'))
      }
      this.user = await this.addAccountUseCase.add(email, password, name)
      if (!this.user) {
        return HttpResponse.serverError()
      }
      return HttpResponse.Created(this.user)
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}
