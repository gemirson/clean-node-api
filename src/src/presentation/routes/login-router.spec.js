const LoginRouter = require('./login-router')
const MissingError = require('../helpers/missing-param-error')
const UnauthorizedError = require('../helpers/unauthorized-error')
const ServerError = require('../helpers/server-error ')

const makeSut = () => {
  const authUseCaseSpy = makeAuthUseCase()
  authUseCaseSpy.acessToken = 'valid_token'
  const sut = new LoginRouter(authUseCaseSpy)
  return {
    sut,
    authUseCaseSpy
  }
}

const makeAuthUseCase = () => {
  class AuthUseCaseSpy {
    async auth (email, password) {
      this.email = email
      this.password = password
      return this.acessToken
    }
  }
  return new AuthUseCaseSpy()
}
const makeAuthUseCaseWithError = () => {
  class AuthUseCaseSpy {
    async auth () {
      throw new Error()
    }
  }
  return new AuthUseCaseSpy()
}

describe('Login Router', () => {
  test('Should return 400 if no password is proveded', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }

    const httpResponse = await sut.router(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingError('email'))
  })

  test('Should return 400 if no email is proveded', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com'
      }
    }
    const httpResponse = await sut.router(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingError('password'))
  })

  test('Should return 500 if no httpResquest is proveded', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.router()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 500 if no httpResquest has no body proveded', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.router({})
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should call AuthUseCase with correct params', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com',
        password: 'any_password'
      }
    }
    await sut.router(httpRequest)
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password)
  })

  test('Should return 401 when invalid crediantials are provided', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    authUseCaseSpy.acessToken = null
    const httpRequest = {
      body: {
        email: 'invalid_email@gmail.com',
        password: 'invalid_password'
      }
    }
    const httpResponse = await sut.router(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  test('Should return 200 when valid crediantials are provided', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'valid_email@gmail.com',
        password: 'valid_password'
      }
    }
    const httpResponse = await sut.router(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.acessToken).toEqual(authUseCaseSpy.acessToken)
  })
  test('Should return 500 if no AuthUseCase is  provided', async () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.router(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 500 if no AuthUseCase has no aut method', async () => {
    const sut = new LoginRouter({})
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.router(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 500 if no AuthUseCase throws', async () => {
    const authUseCaseSpy = makeAuthUseCaseWithError()
    const sut = new LoginRouter(authUseCaseSpy)
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.router(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })
})
