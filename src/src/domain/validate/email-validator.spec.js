const EmailValidator = require('./email-validator')
const validator = require('validator')

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

  test('Shoul call validator if correct email', () => {
    const sut = makeSut()
    sut.isValid('any_email@mail.com')
    expect(validator.email).toBe('any_email@mail.com')
  })
})
