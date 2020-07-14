const { MissingParamError } = require('../../utils/erros')
class AuthUsecase {
  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('email')
    }
  }
}
describe('Auth UseCase', () => {
  test('Shoul return throw if no email is provided', async () => {
    const sut = new AuthUsecase()
    const promise = sut.auth()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('Shoul return throw if no password is provided', async () => {
    const sut = new AuthUsecase()
    const promise = sut.auth('any_email@mail.com')
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })
})
