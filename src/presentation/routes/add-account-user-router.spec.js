const { MissingParamError, InvalidParamError } = require('../../utils/erros')
const { ServerError } = require('../erros')
const AddAccountRoute = require('./add-account-user-router')

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
const MakePasswordValidatorSpy = () => {
  class ValidatorPasswordSpy {
    isValid (password) {
      this.password = password
      return this.isPasswordValid
    }
  }
  const passwordValidatorSpy = new ValidatorPasswordSpy()
  passwordValidatorSpy.isPasswordValid = true
  return passwordValidatorSpy
}

class AddAccountUseCaseSpy {
  async add (email, password, name) {
    this.email = email
    this.password = password
    this.name = name
    return this.user
  }
}

const makeAddAccountUseCase = () => {
  return new AddAccountUseCaseSpy()
}
const makeSut = () => {
  const addAccountUseCaseSpy = makeAddAccountUseCase()
  const emailValidatorSpy = makeEmailValidator()
  const passwordValidatorSpy = MakePasswordValidatorSpy()
  const addAccountRoute = new AddAccountRoute({
    addAccountUseCase: addAccountUseCaseSpy,
    passwordValidator: passwordValidatorSpy,
    emailValidator: emailValidatorSpy
  })

  return {
    sut: addAccountRoute,
    addAccountUseCaseSpy,
    emailValidatorSpy,
    passwordValidatorSpy

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

  test('Should return 400 if  password invalid is proveded', async () => {
    const { sut, passwordValidatorSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com',
        password: 'invalid_password',
        name: 'any_name'
      }
    }
    passwordValidatorSpy.isPasswordValid = false
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new InvalidParamError('password').message)
  })

  test('Should return 400 if  email invalid is proveded', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'invalid_emailgmail.com',
        password: 'valid_Password12',
        name: 'any_name'
      }
    }
    emailValidatorSpy.isEmailValid = false
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new InvalidParamError('email').message)
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
  test('Should return 500 if  AddAccountUseCase return null', async () => {
    const { sut, addAccountUseCaseSpy } = makeSut()
    addAccountUseCaseSpy.user = null
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
  test('Should return 201 when params valid are provided', async () => {
    const { sut, addAccountUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'valid_email@gmail.com',
        password: 'valid_password',
        name: 'any_name'
      }
    }
    addAccountUseCaseSpy.user = {
      email: 'valid_email@gmail.com',
      password: 'valid_password'
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(201)
    expect(httpResponse.body.email).toEqual(addAccountUseCaseSpy.user.email)
    expect(httpResponse.body.name).toEqual(addAccountUseCaseSpy.user.name)
  })
  test('Should throw if invalid dependency are provided', async () => {
    const invalid = {}
    const suts = [].concat(
      new AddAccountRoute(),
      new AddAccountRoute(
        {}
      ),
      new AddAccountRoute({
        addAccountUseCase: invalid
      })
    )
    for (const sut of suts) {
      const httpRequest = {
        body: {
          email: 'valid_email@gmail.com',
          password: 'valid_password',
          name: 'any_name'
        }
      }
      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body.error).toBe(new ServerError().message)
    }
  })
})
