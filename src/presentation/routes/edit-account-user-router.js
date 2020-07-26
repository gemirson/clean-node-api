const { MissingParamError, InvalidParamError } = require('../../utils/erros/index')
const HttpResponse = require('../helpers/http-response')

module.exports = class EditAccountUserRoute {
  constructor ({ editUserUseCase, emailValidator } = {}) {
    this.editUserUseCase = editUserUseCase
    this.emailValidator = emailValidator
  }

  async route (httpRequest) {
    try {
      if (!httpRequest || !httpRequest.body || !this.editUserUseCase || !this.emailValidator) {
        return HttpResponse.serverError()
      }
      const { _Id, name, email } = httpRequest.body
      if (!_Id) {
        return HttpResponse.badRequest(new MissingParamError('_Id'))
      }
      if (!name) {
        return HttpResponse.badRequest(new MissingParamError('name'))
      }
      if (!email) {
        return HttpResponse.badRequest(new MissingParamError('email'))
      }
      const isValidEmail = await this.emailValidator.isValid(email)
      if (!isValidEmail) {
        return HttpResponse.badRequest(new InvalidParamError('email'))
      }
      this.user = await this.editUserUseCase.edit(_Id, {
        name: name,
        email: email
      })
      if (this.user) {
        return HttpResponse.ok(this.user)
      }
      return null
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}
