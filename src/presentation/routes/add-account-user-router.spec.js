const { MissingParamError } = require('../../utils/erros')
const HttpResponse = require('../helpers/http-response')
const { ServerError } = require('../erros')

class AddAccountUseCaseSpy {
  async save (email, password, name) {
    this.email = email
    this.password = password
    this.name = name
    return this.user
  }
}
class AddAccountRoute {
  constructor (addAccountUseCase) {
    this.addAccountUseCase = addAccountUseCase
  }

  async route (httpRequest) {
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
    return this.user
  }
}

const makeSut = () => {
  const addAccountUseCaseSpy = new AddAccountUseCaseSpy()
  const addAccountRoute = new AddAccountRoute(addAccountUseCaseSpy)

  return {
    sut: addAccountRoute,
    addAccountUseCaseSpy
  }
}

describe('Add Account User Route', () => {
  test('Should return 400 if no password is proveded', async () => {
    const { sut } = makeSut()
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
    const { sut } = makeSut()
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
    const { sut } = makeSut()
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
  test('Should return 500 if no httpRequest are proveded', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route({})
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })
  test('Should return 500 if no body are proveded', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })

  test('Should return 500 if no AddAccountUseCase is proveded', async () => {
    const sut = new AddAccountRoute()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })
  test('Should call AddAccountUseCase with correct params', async () => {
    const { sut, addAccountUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com',
        password: 'any_password',
        name: 'any_name'
      }
    }
    await sut.route(httpRequest)
    expect(addAccountUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(addAccountUseCaseSpy.password).toBe(httpRequest.body.password)
    expect(addAccountUseCaseSpy.name).toBe(httpRequest.body.name)
  })
})
