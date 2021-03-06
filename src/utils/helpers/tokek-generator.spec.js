jest.mock('jsonwebtoken', () => ({
  token: 'any_token',
  sign (payload, secret) {
    this.payload = payload
    this.secret = secret
    return this.token
  }
})
)
const jwt = require('jsonwebtoken')
const TokenGenerator = require('./token-generator')
const { MissingParamError } = require('../erros')

const makeSut = () => {
  return new TokenGenerator('secret')
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

  test('Shoul call  jtw with correct values', async () => {
    const sut = makeSut()
    await sut.generate('any_id')
    expect(jwt.payload).toEqual({
      _id: 'any_id'
    })
    expect(jwt.secret).toBe(sut.secret)
  })

  test('Shoul throw if no secret is provided', async () => {
    const sut = new TokenGenerator()
    const promise = sut.generate('any_id')
    expect(promise).rejects.toThrow(new MissingParamError('secret'))
  })

  test('Shoul throw if no id is provided', async () => {
    const sut = new TokenGenerator('secret')
    const promise = sut.generate()
    expect(promise).rejects.toThrow(new MissingParamError('id'))
  })
})
