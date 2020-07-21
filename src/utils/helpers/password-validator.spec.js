jest.mock('password-validator', () => ({
  isPasswordValid: true,
  validate (value) {
    this.value = value
    return this.isPasswordValid
  }
})
)
const passwordValidator = require('password-validator')
const PasswordValidator = require('./password-validator')

const makeSut = () => {
  return new PasswordValidator()
}
describe('Password validator', () => {
  test('Shoul return null if validator-password return null', async () => {
    const sut = makeSut()
    passwordValidator.isPasswordValid = null
    const isValid = await sut.isValid('any_id')
    expect(isValid).toBeNull()
  })
  test('Shoul call  jtw with correct values', async () => {
    const sut = makeSut()
    await sut.isValid('any_id')
    expect(passwordValidator.value).toBe(sut.password)
  })
})
