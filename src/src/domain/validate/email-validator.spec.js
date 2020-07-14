class EmailValidator {
  isValid (email) {
    return true
  }
}

describe('Email Validator', () => {
  test('Shoul return true if validator true', () => {
    const sut = new EmailValidator()
    const isEmailValidator = sut.isValid('valid_email@mail.com')
    expect(isEmailValidator).toBe(true)
  })
})
