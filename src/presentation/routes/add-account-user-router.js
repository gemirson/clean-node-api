const { MissingParamError } = require('../../utils/erros')
const HttpResponse = require('../helpers/http-response')

module.exports = class AddAccountRoute {
  constructor (addAccountUseCase) {
    this.addAccountUseCase = addAccountUseCase
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
      this.user = await this.addAccountUseCase.save(email, password, name)
      if (!this.user) {
        return HttpResponse.serverError()
      }
      return HttpResponse.Created(this.user)
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}
