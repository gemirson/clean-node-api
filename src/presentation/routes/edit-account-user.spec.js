const { MissingParamError } = require('../../utils/erros')
const { ServerError } = require('../erros')
const HttpResponse = require('../helpers/http-response')

const makeEditUserUseCaseSpy = () => {
  class EditUserUseCaseSpy {
    async edit (_Id, { name, email, password } = {}) {
      this._Id = _Id
      this.name = name
      this.email = email
      this.password = password
      return this.user
    }
  }

  const editUserUseCaseSpy = new EditUserUseCaseSpy()
  return editUserUseCaseSpy
}
class EditUserRouteSpy {
  constructor ({ editUserUseCase } = {}) {
    this.editUserUseCase = editUserUseCase
  }

  async route (httpRequest) {
    if (!httpRequest || !httpRequest.body || !this.editUserUseCase) {
      return HttpResponse.serverError()
    }
    const { _Id, name, password, email } = httpRequest.body
    if (!_Id) {
      return HttpResponse.badRequest(new MissingParamError('_Id'))
    }
    this.user = await this.editUserUseCase.edit(_Id, {
      name: name,
      email: email,
      password: password
    })
    return this.user
  }
}

const makeSut = () => {
  const editUserUseCaseSpy = makeEditUserUseCaseSpy()
  const ediUserRouteSpy = new EditUserRouteSpy({
    editUserUseCase: editUserUseCaseSpy
  })
  return {
    sut: ediUserRouteSpy,
    editUserUseCaseSpy: editUserUseCaseSpy
  }
}

describe('Edit user account', () => {
  test('Should return 400 if no Id is proveded', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
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
  test('Should return throw if no EditUserUseCase is proveded', async () => {
    const sut = new EditUserRouteSpy()
    const httpRequest = {
      body: {
        _Id: 'any_Id',
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })

  test('Should return user null if  EditUserUseCase return null', async () => {
    const { sut, editUserUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        _Id: 'any_Id',
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      }
    }
    editUserUseCaseSpy.user = null
    const user = await sut.route(httpRequest)
    expect(user).toBeNull()
  })

  test('Should call EditUserUseCase with correct params', async () => {
    const { sut, editUserUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        _Id: 'any_Id',
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      }
    }
    await sut.route(httpRequest)
    expect(editUserUseCaseSpy.name).toBe(httpRequest.body.name)
    expect(editUserUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(editUserUseCaseSpy.password).toBe(httpRequest.body.password)
    expect(editUserUseCaseSpy._Id).toBe(httpRequest.body._Id)
  })
})
