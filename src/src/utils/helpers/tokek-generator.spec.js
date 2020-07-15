
class TokenGenerator {
  async generate (id) {
    if (!id) {
      return null
    }
    return null
  }
}

describe('Token Generator', () => {
  test('Shoul return null jtw return null', async () => {
    const sut = new TokenGenerator()
    const token = await sut.generate('any_id')
    expect(token).toBeNull()
  })
})
