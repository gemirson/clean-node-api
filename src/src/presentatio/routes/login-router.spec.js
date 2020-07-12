const LoginRouter = require('./login-router')
const MissingError = require('../helpers/missing-param-error')

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
