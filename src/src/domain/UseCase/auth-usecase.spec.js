const { MissingParamError } = require('../../utils/erros')
const AuthUsecase = require('./auth-usecase')

const makeEncrypter = () => {
  class EncrypterSpy {
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword
      return this.isValid
    }
  }
  const encrypterSpy = new EncrypterSpy()
  encrypterSpy.isValid = true
  return encrypterSpy
}

const makeTokenGeneratorSpy = () => {
  class TokenGeneratorSpy {
    async generate (userId) {
      this.userId = userId
      return this.acessToken
    }
  }
  const tokenGeneratorSpy = new TokenGeneratorSpy()
  tokenGeneratorSpy.acessToken = 'any_token'
  return tokenGeneratorSpy
}

const makeloadUseByEmailRepository = () => {
  class LoadUseByEmailRepositorySpy {
    async load (email) {
      this.email = email
      return this.user
    }
  }
  const loadUseByEmailRepositorySpy = new LoadUseByEmailRepositorySpy()
  loadUseByEmailRepositorySpy.user = {
    id: 'any_id',
    password: 'hashed_password'

  }
  return loadUseByEmailRepositorySpy
}

const makeloadUseByEmailRepositoryWithError = () => {
  class LoadUseByEmailRepositoryWithErrorSpy {
    async load () {
      throw new Error()
    }
  }
  return new LoadUseByEmailRepositoryWithErrorSpy()
}

const makeEncrypterWithError = () => {
  class EncrypterWithError {
    async compare () {
      throw new Error()
    }
  }
  return new EncrypterWithError()
}

const makeTokenGeneratorWithError = () => {
  class TokenGeneratorWithError {
    async generate () {
      throw new Error()
    }
  }
  return new TokenGeneratorWithError()
}
const makeUpdateAcessTokenGenerator = () => {
  class UpdateAcessTokenGeneratorSpy {
    async update (userId, acessToken) {
      this.userId = userId
      this.acessToken = acessToken
    }
  }
  return new UpdateAcessTokenGeneratorSpy()
}

const makeSut = () => {
  const encrypterSpy = makeEncrypter()
  const loadUseByEmailRepositorySpy = makeloadUseByEmailRepository()
  const tokenGeneratorSpy = makeTokenGeneratorSpy()
  const updateAcessTokenGeneratorSpy = makeUpdateAcessTokenGenerator()
  const sut = new AuthUsecase({
    loadUseByEmailRepository: loadUseByEmailRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy,
    updateAcessTokenGenerator: updateAcessTokenGeneratorSpy
  })

  return {
    sut,
    loadUseByEmailRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy,
    updateAcessTokenGeneratorSpy
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

  test('Should return null if  an invalid email is provided', async () => {
    const { sut, loadUseByEmailRepositorySpy } = makeSut()
    loadUseByEmailRepositorySpy.user = null
    const acessToken = await sut.auth('invalid_email@mail.com', 'any_password')
    expect(acessToken).toBeNull()
  })

  test('Should return null if  an invalid password is provided', async () => {
    const { sut, encrypterSpy } = makeSut()
    encrypterSpy.isValid = false
    const acessToken = await sut.auth('valid_email@mail.com', 'invalid_password')
    expect(acessToken).toBeNull()
  })

  test('Should call Encrypter with correct password  values', async () => {
    const { sut, loadUseByEmailRepositorySpy, encrypterSpy } = makeSut()
    await sut.auth('valid_email@mail.com', 'any_password')
    expect(encrypterSpy.password).toBe('any_password')
    expect(encrypterSpy.hashedPassword).toBe(loadUseByEmailRepositorySpy.user.password)
  })

  test('Should call TokenGeneration with correct userId', async () => {
    const { sut, loadUseByEmailRepositorySpy, tokenGeneratorSpy } = makeSut()
    await sut.auth('valid_email@mail.com', 'valid_password')
    expect(tokenGeneratorSpy.userId).toBe(loadUseByEmailRepositorySpy.user.id)
  })

  test('Should return an acessToken is credentials are correct', async () => {
    const { sut, tokenGeneratorSpy } = makeSut()
    const acessToken = await sut.auth('valid_email@mail.com', 'valid_password')
    expect(acessToken).toBe(tokenGeneratorSpy.acessToken)
    expect(acessToken).toBeTruthy()
  })

  test('Should call UpdateTokenGeneration with correct values', async () => {
    const { sut, loadUseByEmailRepositorySpy, tokenGeneratorSpy, updateAcessTokenGeneratorSpy } = makeSut()
    await sut.auth('valid_email@mail.com', 'valid_password')
    expect(updateAcessTokenGeneratorSpy.userId).toBe(loadUseByEmailRepositorySpy.user.id)
    expect(updateAcessTokenGeneratorSpy.acessToken).toBe(tokenGeneratorSpy.acessToken)
  })

  test('Should throw if invalid dependency are provided', async () => {
    const invalid = {}
    const loadUseByEmailRepository = makeloadUseByEmailRepository()
    const encrypter = makeEncrypter()

    const suts = [].concat(
      new AuthUsecase(),
      new AuthUsecase({
        loadUseByEmailRepository: null,
        encrypter: null,
        tokenGenerator: null
      }),
      new AuthUsecase({
        loadUseByEmailRepository: invalid,
        encrypter: null,
        tokenGenerator: null
      }),
      new AuthUsecase({
        loadUseByEmailRepository,
        encrypter: null,
        tokenGenerator: null

      }),
      new AuthUsecase({
        loadUseByEmailRepository,
        encrypter: invalid,
        tokenGenerator: null
      }),
      new AuthUsecase({
        loadUseByEmailRepository,
        encrypter,
        tokenGenerator: null
      }),
      new AuthUsecase({
        loadUseByEmailRepository,
        encrypter,
        tokenGenerator: invalid
      })

    )
    for (const sut of suts) {
      const promise = sut.auth('any_email@mail.com', 'any_password')
      expect(promise).rejects.toThrow()
    }
  })

  test('Should throw if any dependency throws', async () => {
    const loadUseByEmailRepository = makeloadUseByEmailRepository()
    const encrypter = makeEncrypter()
    const suts = [].concat(
      new AuthUsecase({
        loadUseByEmailRepository: makeloadUseByEmailRepositoryWithError(),
        encrypter: null,
        tokenGenerator: null
      }),
      new AuthUsecase({
        loadUseByEmailRepository,
        encrypter: makeEncrypterWithError(),
        tokenGenerator: null
      }),
      new AuthUsecase({
        loadUseByEmailRepository,
        encrypter,
        tokenGenerator: makeTokenGeneratorWithError()
      })

    )
    for (const sut of suts) {
      const promise = sut.auth('any_email@mail.com', 'any_password')
      expect(promise).rejects.toThrow()
    }
  })
})
