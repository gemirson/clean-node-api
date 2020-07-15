const jwt = require('jsonwebtoken')

class TokenGenerator {
  async generate (id) {
    if (!id) {
      return null
    }
    return jwt.sign(id, 'secret')
  }
}

const makeSut = () => {
  return new TokenGenerator()
}

describe('Token Generator', () => {
  test('Shoul return null jtw return null', async () => {
    const sut = makeSut()
    jwt.token = null
    const token = await sut.generate('any_id')
    expect(token).toBeNull()
  })

  test('Shoul return token jtw token null', async () => {
    const sut = makeSut()
    const token = await sut.generate('any_id')
    expect(token).toBe(jwt.token)
  })
})
