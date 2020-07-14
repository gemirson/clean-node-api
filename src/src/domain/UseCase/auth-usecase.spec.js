const { MissingParamError } = require('../../utils/erros')
class AuthUsecase {
  async auth (email) {
    if (!email) {
      throw new MissingParamError('email')
    }
  }
}
describe('Auth UseCase', () => {
  test('Shoul return null if no email is provided', async () => {
    const sut = new AuthUsecase()
    const promise = sut.auth()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
})
