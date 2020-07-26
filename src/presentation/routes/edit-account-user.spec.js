const { MissingParamError, InvalidParamError } = require('../../utils/erros')
const { ServerError } = require('../erros')
const EditAccountUserRoute = require('./edit-account-user-router')

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

const makeEmailValidatorWithError = () => {
  class EmailValidatorSpy {
    isValid () {
      throw new Error()
    }
  }
  return new EmailValidatorSpy()
}
const makeEditUserUseCaseWithError = () => {
  class EditUserUseCaseSpy {
    isValid () {
      throw new Error()
    }
  }
  return new EditUserUseCaseSpy()
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

const makeSut = () => {
  const editUserUseCaseSpy = makeEditUserUseCaseSpy()
  const emailValidatorSpy = makeEmailValidator()
  const ediUserRouteSpy = new EditAccountUserRoute({
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
  test('Should return 400 if no name is proveded', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        _Id: 'valid_Id'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new MissingParamError('name').message)
  })

  test('Should return 400 if no email is proveded', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        _Id: 'valid_Id',
        name: 'any_name'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new MissingParamError('email').message)
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
  test('Should return throw if no body is proveded', async () => {
    const { sut } = makeSut()
    const httpRequest = {
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })

  test('Should return  200 when call EditUserUseCase with params corrects', async () => {
    const { sut, editUserUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        _Id: 'any_Id',
        name: 'any_name',
        email: 'any_email@gmail.com'
      }
    }
    editUserUseCaseSpy.user = {
      _Id: 'any_Id',
      name: 'any_name',
      email: 'any_email@gmail.com'
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(httpRequest.body)
  })
  test('Should return throw if no EditUserUseCase is proveded', async () => {
    const sut = new EditAccountUserRoute()
    const httpRequest = {
      body: {
        _Id: 'any_Id',
        name: 'any_name',
        email: 'any_email@gmail.com'
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
        email: 'any_email@gmail.com'
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
        email: 'any_email@gmail.com'
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
  test('Should throw if invalid dependency are provided', async () => {
    const invalid = {}
    const emailValidator = makeEmailValidator()
    const suts = [].concat(
      new EditAccountUserRoute(),
      new EditAccountUserRoute(
        {}
      ),
      new EditAccountUserRoute({
        EditUserRouteSpy: invalid
      }),
      new EditAccountUserRoute({
        EditUserRouteSpy: invalid,
        emailValidator
      }),
      new EditAccountUserRoute({
        emailValidator
      })
    )
    for (const sut of suts) {
      const httpRequest = {
        body: {
          _Id: 'valid_Id',
          email: 'valid_email@gmail.com',
          name: 'any_name'
        }
      }
      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body.error).toBe(new ServerError().message)
    }
  })

  test('Should throw if any dependency throws', async () => {
    const editUserUseCase = makeEditUserUseCaseSpy()
    const emailValidator = makeEmailValidator()

    const suts = [].concat(
      new EditAccountUserRoute({
        editUserUseCase: makeEditUserUseCaseWithError(),
        emailValidator
      }),
      new EditAccountUserRoute({
        editUserUseCase,
        emailValidator: makeEmailValidatorWithError()
      })
    )

    for (const sut of suts) {
      const httpRequest = {
        body: {
          _Id: 'valid_Id',
          email: 'any_email@gmail.com',
          name: 'valid_name'
        }
      }
      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body.error).toBe(new ServerError().message)
    }
  })
})
