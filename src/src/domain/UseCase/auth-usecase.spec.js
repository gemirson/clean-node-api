const { MissingParamError } = require('../../utils/erros')
class AuthUsecase {
  constructor (loadUseByEmailRepositorySpy) {
    this.loadUseByEmailRepositorySpy = loadUseByEmailRepositorySpy
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('email')
    }
    await this.loadUseByEmailRepositorySpy.load(email)
  }
}
describe('Auth UseCase', () => {
  test('Should return throw if no email is provided', async () => {
    const sut = new AuthUsecase()
    const promise = sut.auth()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('Should return throw if no password is provided', async () => {
    const sut = new AuthUsecase()
    const promise = sut.auth('any_email@mail.com')
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  test('Should call LoadUseByEmailRepository with correct email', async () => {
    class LoadUseByEmailRepositorySpy {
      async load (email) {
        this.email = email
      }
    }
    const loadUseByEmailRepositorySpy = new LoadUseByEmailRepositorySpy()
    const sut = new AuthUsecase(loadUseByEmailRepositorySpy)
    await sut.auth('any_email@mail.com', 'any_password')
    expect(loadUseByEmailRepositorySpy.email).toBe('any_email@mail.com')
  })
})
