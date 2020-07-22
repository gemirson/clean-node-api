const UserPasswordValidator = require('./password-validator-user')
const { MissingParamError } = require('../erros')

const makeSut = () => {
  const sut = new UserPasswordValidator()
  return {
    sut
  }
}
describe('Password validator', () => {
  test('Shoul return true if validator-password return true', async () => {
    const { sut } = makeSut()
    const isValid = await sut.isValid('any_Password123')
    expect(isValid).toBeTruthy()
  })
  test('Shoul return false if validator-password return false', async () => {
    const { sut } = makeSut()
    const isValid = await sut.isValid('any_password')
    expect(isValid).toBeFalsy()
  })
  test('Shoul throw if no password is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.isValid()
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })
})
