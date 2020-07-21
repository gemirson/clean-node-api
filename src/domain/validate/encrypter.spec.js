jest.mock('bcrypt', () => ({
  isValid: true,
  async compare (value, hashvalue) {
    this.value = value
    this.hashvalue = hashvalue
    return this.isValid
  },
  async hashSync (value, base) {
    this.hashresult = 'hashed_password'
    this.valueS = value
    this.base = base
    return this.hashresult
  }
})
)
const Encrypter = require('./encrypter')
const bcrypt = require('bcrypt')
const { MissingParamError } = require('../../utils/erros')

const makeSut = () => {
  return new Encrypter()
}

describe('Encrypter', () => {
  test('Shoul return true if bcrypt return true', async () => {
    const sut = makeSut()
    const isValid = await sut.compare('any_value', 'hashed_value')
    expect(isValid).toBe(true)
  })

  test('Shoul return false if bcrypt return false', async () => {
    const sut = makeSut()
    bcrypt.isValid = false
    const isValid = await sut.compare('any_value', 'hashed_value')
    expect(isValid).toBe(false)
  })

  test('Should call bcrypt with correct values', async () => {
    const sut = makeSut()
    await sut.compare('any_value', 'hashed_value')
    expect(bcrypt.value).toBe('any_value')
    expect(bcrypt.hashvalue).toBe('hashed_value')
  })

  test('Should call bcrypt hash with correct values', async () => {
    const sut = makeSut()
    const hashedpassword = await sut.hashSync('any_value', 10)
    expect(bcrypt.valueS).toBe('any_value')
    expect(bcrypt.base).toBe(10)
    expect(hashedpassword).toBe('hashed_password')
  })
  test('Should throw if no param are provided', async () => {
    const sut = makeSut()
    expect(sut.compare()).rejects.toThrow(new MissingParamError('value'))
    expect(sut.compare('any_value')).rejects.toThrow(new MissingParamError('hash'))
  })

  test('Should throw hashSync if no param are provided', async () => {
    const sut = makeSut()
    expect(sut.hashSync()).rejects.toThrow(new MissingParamError('value'))
    expect(sut.hashSync('any_value')).rejects.toThrow(new MissingParamError('base'))
  })
})
