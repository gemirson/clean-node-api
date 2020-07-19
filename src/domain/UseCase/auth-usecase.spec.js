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

const makeloadUserByEmailRepository = () => {
  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email
      return this.user
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  loadUserByEmailRepositorySpy.user = {
    id: 'any_id',
    password: 'hashed_password'

  }
  return loadUserByEmailRepositorySpy
}

const makeloadUserByEmailRepositoryWithError = () => {
  class LoadUserByEmailRepositoryWithErrorSpy {
    async load () {
      throw new Error()
    }
  }
  return new LoadUserByEmailRepositoryWithErrorSpy()
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

const makeUpdateAcessTokenRepositorySpy = () => {
  class UpdateAcessTokenRepositorySpy {
    async update (userId, acessToken) {
      this.userId = userId
      this.acessToken = acessToken
    }
  }
  return new UpdateAcessTokenRepositorySpy()
}

const makeUpdateAcessTokenGeneratorWithError = () => {
  class UpdateAcessTokenGeneratorWithError {
    async update () {
      throw new Error()
    }
  }
  return new UpdateAcessTokenGeneratorWithError()
}

const makeSut = () => {
  const encrypterSpy = makeEncrypter()
  const loadUserByEmailRepositorySpy = makeloadUserByEmailRepository()
  const tokenGeneratorSpy = makeTokenGeneratorSpy()
  const updateAcessTokenRepositorySpy = makeUpdateAcessTokenRepositorySpy()
  const sut = new AuthUsecase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy,
    updateAcessTokenRepository: updateAcessTokenRepositorySpy
  })

  return {
    sut,
    loadUserByEmailRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy,
    updateAcessTokenRepositorySpy
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
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    await sut.auth('any_email@mail.com', 'any_password')
    expect(loadUserByEmailRepositorySpy.email).toBe('any_email@mail.com')
  })

  test('Should return null if  an invalid email is provided', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.user = null
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
    const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut()
    await sut.auth('valid_email@mail.com', 'any_password')
    expect(encrypterSpy.password).toBe('any_password')
    expect(encrypterSpy.hashedPassword).toBe(loadUserByEmailRepositorySpy.user.password)
  })

  test('Should call TokenGeneration with correct userId', async () => {
    const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut()
    await sut.auth('valid_email@mail.com', 'valid_password')
    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user._id)
  })

  test('Should return an acessToken is credentials are correct', async () => {
    const { sut, tokenGeneratorSpy } = makeSut()
    const acessToken = await sut.auth('valid_email@mail.com', 'valid_password')
    expect(acessToken).toBe(tokenGeneratorSpy.acessToken)
    expect(acessToken).toBeTruthy()
  })

  test('Should call UpdateTokenGeneration with correct values', async () => {
    const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy, updateAcessTokenRepositorySpy } = makeSut()
    await sut.auth('valid_email@mail.com', 'valid_password')
    expect(updateAcessTokenRepositorySpy.userId).toBe(loadUserByEmailRepositorySpy.user._id)
    expect(updateAcessTokenRepositorySpy.acessToken).toBe(tokenGeneratorSpy.acessToken)
  })

  test('Should throw if invalid dependency are provided', async () => {
    const invalid = {}
    const loadUserByEmailRepository = makeloadUserByEmailRepository()
    const encrypter = makeEncrypter()
    const tokenGenerator = makeTokenGeneratorSpy()
    const updateAcessTokenRepository = makeUpdateAcessTokenRepositorySpy()
    const suts = [].concat(
      new AuthUsecase(),
      new AuthUsecase({
        loadUserByEmailRepository: null,
        encrypter: null,
        tokenGenerator: null
      }),
      new AuthUsecase({
        loadUserByEmailRepository: invalid,
        encrypter: null,
        tokenGenerator: null
      }),
      new AuthUsecase({
        loadUserByEmailRepository,
        encrypter: null,
        tokenGenerator: null

      }),
      new AuthUsecase({
        loadUserByEmailRepository,
        encrypter: invalid,
        tokenGenerator: null
      }),
      new AuthUsecase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator: null
      }),
      new AuthUsecase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator: invalid
      }),
      new AuthUsecase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator,
        updateAcessTokenRepository: null
      }),
      new AuthUsecase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator,
        updateAcessTokenRepository: invalid
      }),
      new AuthUsecase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator: null,
        updateAcessTokenRepository
      })

    )
    for (const sut of suts) {
      const promise = sut.auth('any_email@mail.com', 'any_password')
      expect(promise).rejects.toThrow()
    }
  })

  test('Should throw if any dependency throws', async () => {
    const loadUserByEmailRepository = makeloadUserByEmailRepository()
    const encrypter = makeEncrypter()
    const tokenGenerator = makeTokenGeneratorSpy()

    const suts = [].concat(
      new AuthUsecase({
        loadUserByEmailRepository: makeloadUserByEmailRepositoryWithError(),
        encrypter: null,
        tokenGenerator: null
      }),
      new AuthUsecase({
        loadUserByEmailRepository,
        encrypter: makeEncrypterWithError(),
        tokenGenerator: null
      }),
      new AuthUsecase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator: makeTokenGeneratorWithError()
      }),

      new AuthUsecase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator,
        updateAcessTokenGenerator: makeUpdateAcessTokenGeneratorWithError()
      })

    )
    for (const sut of suts) {
      const promise = sut.auth('any_email@mail.com', 'any_password')
      expect(promise).rejects.toThrow()
    }
  })
})
