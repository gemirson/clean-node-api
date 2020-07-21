const { MissingParamError } = require('../../utils/erros')
const HttpResponse = require('../helpers/http-response')

class AddAccountRoute {
  async route (httpRequest) {
    if (!httpRequest || !httpRequest.body) {
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
  }
}

describe('Add Account User Route', () => {
  test('Should return 400 if no password is proveded', async () => {
    const sut = new AddAccountRoute()
    const httpRequest = {
      body: {
        email: 'any_email'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new MissingParamError('password').message)
  })
  test('Should return 400 if no email is proveded', async () => {
    const sut = new AddAccountRoute()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new MissingParamError('email').message)
  })
  test('Should return 400 if no name is proveded', async () => {
    const sut = new AddAccountRoute()
    const httpRequest = {
      body: {
        email: 'any_email',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new MissingParamError('name').message)
  })
})
