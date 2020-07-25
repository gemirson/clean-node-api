const { MissingParamError } = require('../../utils/erros')
const { ServerError } = require('../erros')
const HttpResponse = require('../helpers/http-response')

const makeEditUserRouteSpy = () => {
  class EditUserRouteSpy {
    async route (httpRequest) {
      if (!httpRequest || !httpRequest.body) {
        return HttpResponse.serverError()
      }
      const { _Id } = httpRequest.body
      if (!_Id) {
        return HttpResponse.badRequest(new MissingParamError('email'))
      }
      return {
        statusCode: 400,
        body: {
          error: 'Missing param: _Id'
        }
      }
    }
  }
  const ediUserRouteSpy = new EditUserRouteSpy()
  return ediUserRouteSpy
}
const makeSut = () => {
  const ediUserRouteSpy = makeEditUserRouteSpy()
  return {
    sut: ediUserRouteSpy
  }
}

describe('Edit user account', () => {
  test('Should return 400 if no Id is proveded', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        _Id: 'any_Id'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new MissingParamError('_Id').message)
  })
  test('Should return throw if no httpResquest is proveded', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })

  test('Should return throw if no body is proveded', async () => {
    const { sut } = makeSut()
    const httpRequest = {
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })
})
