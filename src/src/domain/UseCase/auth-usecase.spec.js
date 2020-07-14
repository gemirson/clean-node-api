const { MissingParamError, InvalidParamError } = require('../../utils/erros')

class AuthUsecase {
  constructor (loadUseByEmailRepository) {
    this.loadUseByEmailRepository = loadUseByEmailRepository
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('email')
    }
    if (!this.loadUseByEmailRepository) {
      throw new MissingParamError('loadUseByEmailRepository')
    }

    if (!this.loadUseByEmailRepository.load) {
      throw new InvalidParamError('loadUseByEmailRepository')
    }
    await this.loadUseByEmailRepository.load(email)
  }
}

const makeSut = () => {
  class LoadUseByEmailRepositorySpy {
    async load (email) {
      this.email = email
    }
  }
  const loadUseByEmailRepositorySpy = new LoadUseByEmailRepositorySpy()
  const sut = new AuthUsecase(loadUseByEmailRepositorySpy)
  return {
    sut,
    loadUseByEmailRepositorySpy
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
    expect(promise).rejects.toThrow(new MissingParamError('loadUseByEmailRepository'))
  })

  test('Should throw if no LoadUseByEmailRepository hasno load lethod', async () => {
    const sut = new AuthUsecase({})
    const promise = sut.auth('any_email@mail.com', 'any_password')
    expect(promise).rejects.toThrow(new InvalidParamError('loadUseByEmailRepository'))
  })
})
