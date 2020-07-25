const { MissingParamError, InvalidParamError } = require('../../utils/erros')
const { ServerError } = require('../erros')
const HttpResponse = require('../helpers/http-response')

const makeEmailValidator = () => {
  class EmailValidatorSpy {
    isValid (email) {
      this.email = email
      return this.isEmailValid
    }
  }

  const emailValidatorSpy = new EmailValidatorSpy()
  emailValidatorSpy.isEmailValid = true
  return emailValidatorSpy
}
const makeEditUserUseCaseSpy = () => {
  class EditUserUseCaseSpy {
    async edit (_Id, { name, email } = {}) {
      this._Id = _Id
      this.name = name
      this.email = email
      return this.user
    }
  }

  const editUserUseCaseSpy = new EditUserUseCaseSpy()
  return editUserUseCaseSpy
}
class EditUserRouteSpy {
  constructor ({ editUserUseCase, emailValidator } = {}) {
    this.editUserUseCase = editUserUseCase
    this.emailValidator = emailValidator
  }

  async route (httpRequest) {
    if (!httpRequest || !httpRequest.body || !this.editUserUseCase) {
      return HttpResponse.serverError()
    }
    const { _Id, name, email } = httpRequest.body
    if (!_Id) {
      return HttpResponse.badRequest(new MissingParamError('_Id'))
    }
    const isValidEmail = await this.emailValidator.isValid(email)
    if (!isValidEmail) {
      return HttpResponse.badRequest(new InvalidParamError('email'))
    }
    this.user = await this.editUserUseCase.edit(_Id, {
      name: name,
      email: email
    })
    return this.user
  }
}

const makeSut = () => {
  const editUserUseCaseSpy = makeEditUserUseCaseSpy()
  const emailValidatorSpy = makeEmailValidator()
  const ediUserRouteSpy = new EditUserRouteSpy({
    editUserUseCase: editUserUseCaseSpy,
    emailValidator: emailValidatorSpy
  })
  return {
    sut: ediUserRouteSpy,
    editUserUseCaseSpy: editUserUseCaseSpy,
    emailValidatorSpy: emailValidatorSpy
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
        email: 'any_email'
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
        email: 'any_email'
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
        email: 'any_email'
      }
    }
    await sut.route(httpRequest)
    expect(editUserUseCaseSpy.name).toBe(httpRequest.body.name)
    expect(editUserUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(editUserUseCaseSpy._Id).toBe(httpRequest.body._Id)
  })
  test('Should return throw if invalid emaild is proveded', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    const httpRequest = {
      body: {
        _Id: 'any_Id',
        name: 'any_name',
        email: 'any_emailgmail.com'
      }
    }
    emailValidatorSpy.isEmailValid = false
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new InvalidParamError('email').message)
  })
})
