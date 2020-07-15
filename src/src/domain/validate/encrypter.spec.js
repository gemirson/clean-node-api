
class Encrypter {
  async compare (password, hashedPassword) {
    return true
  }
}

describe('Email Validator', () => {
  test('Shoul return true if bcrypt return true', async () => {
    const sut = new Encrypter()
    const isValid = await sut.compare('any_password', 'hashed_password')
    expect(isValid).toBe(true)
  })
})
