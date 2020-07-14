const validator = require('validator')
class EmailValidator {
  isValid (email) {
    return validator.isEmail(email)
  }
}

const makeSut = () => {
  return new EmailValidator()
}

describe('Email Validator', () => {
  test('Shoul return true if validator true', () => {
    const sut = makeSut()
    const isEmailValidator = sut.isValid('valid_email@mail.com')
    expect(isEmailValidator).toBe(true)
  })

  test('Shoul return false if validator false', () => {
    validator.isEmailValid = false
    const sut = makeSut()
    const isEmailValidator = sut.isValid('invalid_email@mail.com')
    expect(isEmailValidator).toBe(false)
  })
})
