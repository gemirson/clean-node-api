class LoginRouter {
  router (httpRequest) {
    if (!httpRequest || !httpRequest.body) {
      return httpResponse.serverError()
    }
    const { email, password } = httpRequest.body
    if (!email) {
      return httpResponse.badRequest('email')
    }

    if (!password) {
      return httpResponse.badRequest('password')
    }
  }
}

class httpResponse {
  static badRequest (paraName) {
    return {
      statusCode: 400,
      body: new MissingError(paraName)
    }
  }

  static serverError () {
    return {
      statusCode: 500
    }
  }
}

class MissingError extends Error {
  constructor (paraName) {
    super(`Missing param: ${paraName}`)
    this.name = 'MissingParamError'
  }
}

describe('Login Router', () => {
  test('Should return 400 if no password is proveded', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }

    const httpResponse = sut.router(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingError('email'))
  })

  test('Should return 400 if no email is proveded', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com'
      }
    }
    const httpResponse = sut.router(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingError('password'))
  })

  test('Should return 500 if no httpResquest is proveded', () => {
    const sut = new LoginRouter()
    const httpResponse = sut.router()
    expect(httpResponse.statusCode).toBe(500)
  })

  test('Should return 500 if no httpResquest has no body proveded', () => {
    const sut = new LoginRouter()
    const httpResponse = sut.router({})
    expect(httpResponse.statusCode).toBe(500)
  })
})
