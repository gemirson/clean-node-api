const { MissingParamError } = require('../../utils/erros')
const { ServerError } = require('../erros')

const makeEditUserRouteSpy = () => {
  class EditUserRouteSpy {
    async route (httpRequest) {
      if (!httpRequest) {
        throw new ServerError()
      }
      const { _Id } = httpRequest.body
      if (!_Id) {
        return new MissingParamError('_Id')
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
})
