const { MissingParamError } = require('../../utils/erros')
const AuthUsecase = require('./auth-usecase')

const makeSut = () => {
  class EncrypterSpy {
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword
    }
  }
  class LoadUseByEmailRepositorySpy {
    async load (email) {
      this.email = email
      return this.user
    }
  }
  const encrypterSpy = new EncrypterSpy()
  const loadUseByEmailRepositorySpy = new LoadUseByEmailRepositorySpy()
  loadUseByEmailRepositorySpy.user = {
    password: 'hashed_password'
  }
  const sut = new AuthUsecase(loadUseByEmailRepositorySpy, encrypterSpy)
  return {
    sut,
    loadUseByEmailRepositorySpy,
    encrypterSpy
  }
}

describe('Auth UseCase', () => {
  test('Should return throw if no email is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('Should return throw if no password is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth('any_email@mail.com')
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  test('Should call LoadUseByEmailRepository with correct email', async () => {
    const { sut, loadUseByEmailRepositorySpy } = makeSut()
    await sut.auth('any_email@mail.com', 'any_password')
    expect(loadUseByEmailRepositorySpy.email).toBe('any_email@mail.com')
  })

  test('Should throw if no LoadUseByEmailRepository is provided', async () => {
    const sut = new AuthUsecase()
    const promise = sut.auth('any_email@mail.com', 'any_password')
    expect(promise).rejects.toThrow()
  })

  test('Should throw if no LoadUseByEmailRepository hasno load lethod', async () => {
    const sut = new AuthUsecase({})
    const promise = sut.auth('any_email@mail.com', 'any_password')
    expect(promise).rejects.toThrow()
  })

  test('Should return null if  an invalid email is provided', async () => {
    const { sut, loadUseByEmailRepositorySpy } = makeSut()
    loadUseByEmailRepositorySpy.user = null
    const acessToken = await sut.auth('invalid_email@mail.com', 'any_password')
    expect(acessToken).toBeNull()
  })

  test('Should return null if  an invalid password is provided', async () => {
    const { sut } = makeSut()
    const acessToken = await sut.auth('valid_email@mail.com', 'invalid_password')
    expect(acessToken).toBeNull()
  })

  test('Should call Encrypter with correct password  values', async () => {
    const { sut, loadUseByEmailRepositorySpy, encrypterSpy } = makeSut()
    await sut.auth('valid_email@mail.com', 'any_password')
    expect(encrypterSpy.password).toBe('any_password')
    expect(encrypterSpy.hashedPassword).toBe(loadUseByEmailRepositorySpy.user.password)
  })
})
