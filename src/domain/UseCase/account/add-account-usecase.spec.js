jest.mock('bcrypt', () => ({
  isValid: true,
  async hash (value) {
    this.value = value
    return this.isValid
  }
})
)
const { MissingParamError, InvalidParamError } = require('../../../utils/erros')

const MakeEmailValidatorSpy = () => {
  class EmailValidatorSpy {
    isValid (email) {
      this.email = email
      return this.isEmailValid
    }
  }

  const emailValidatorSpy = new EmailValidatorSpy()
  emailValidatorSpy.isEmailValid = true
  return emailValidatorSpy
}
const MakeEmailValidatorWithError = () => {
  class EmailValidatorWithError {
    async update () {
      throw new Error()
    }
  }
  return new EmailValidatorWithError()
}
const MakePasswordValidatorSpy = () => {
  class PasswordValidatorSpy {
    isPassword (password) {
      if (!password) {
        throw new MissingParamError('password')
      }
      return this.isPasswordValid
    }
  }

  const passwordValidatorSpy = new PasswordValidatorSpy()
  passwordValidatorSpy.isPasswordValid = true
  return passwordValidatorSpy
}
const MakePasswordValidatorWithError = () => {
  class PasswordValidatorWithError {
    async update () {
      throw new Error()
    }
  }
  return new PasswordValidatorWithError()
}

class AddAccountUseCaseSpy {
  constructor ({ saveUserRepository, passwordValidator, emailValidator, encrypter } = {}) {
    this.saveUserRepository = saveUserRepository
    this.passwordValidator = passwordValidator
    this.emailValidator = emailValidator
    this.encrypter = encrypter
  }

  async add (email, password, name) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }
    if (!name) {
      throw new MissingParamError('name')
    }
    if (!this.passwordValidator.isPassword(password)) {
      throw new InvalidParamError('password')
    }
    if (!this.emailValidator.isValid(email)) {
      throw new InvalidParamError('email')
    }
    this.has_password = await this.encrypter.hash(password, 10)
    this.user = await this.saveUserRepository.save(email, this.has_password, name)
    const isValid = this.user && this.passwordValidator.isPassword(password) &&
     this.emailValidator.isValid(email)
    if (!isValid) {
      return this.user
    }
    return null
  }
}
const MakeEncrypterSpy = () => {
  class EncrypterSpy {
    async hash (value, base) {
      this.has_value = 'hashed_password'
      this.value = value
      this.base = base
      return this.has_value
    }
  }
  const encrypterSpy = new EncrypterSpy()
  return encrypterSpy
}

const MakeSaveUserRepositorySpy = () => {
  class SaveUserRepositorySpy {
    async save (email, hashpassword, name) {
      this.email = email
      this.hash_password = hashpassword
      this.name = name
      if (!email) {
        throw new MissingParamError('email')
      }
      if (!hashpassword) {
        throw new MissingParamError('hashpassword')
      }
      if (!name) {
        throw new MissingParamError('name')
      }
      return this.user
    }
  }
  const saveUserRepositorySpy = new SaveUserRepositorySpy()
  return saveUserRepositorySpy
}
const MakeSaveUserRepositoryWithError = () => {
  class SaveUserRepositoryWithError {
    async update () {
      throw new Error()
    }
  }
  return new SaveUserRepositoryWithError()
}
const makeSut = () => {
  const saveUserRepositorySpy = MakeSaveUserRepositorySpy()
  const passwordValidatorSpy = MakePasswordValidatorSpy()
  const emailValidatorSpy = MakeEmailValidatorSpy()
  const encrypterSpy = MakeEncrypterSpy()
  const sut = new AddAccountUseCaseSpy({
    saveUserRepository: saveUserRepositorySpy,
    passwordValidator: passwordValidatorSpy,
    emailValidator: emailValidatorSpy,
    encrypter: encrypterSpy
  })

  return {
    sut,
    saveUserRepositorySpy,
    passwordValidatorSpy,
    emailValidatorSpy,
    encrypterSpy
  }
}

describe('AddAccount ', () => {
  test('Should return throw if no email is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.add()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
  test('Should return throw if no password is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.add('any_email@gmail.com')
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })
  test('Should return throw if no email is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.add('any_email@gmail.com', 'hashed_password')
    expect(promise).rejects.toThrow(new MissingParamError('name'))
  })
  test('Should call SaveUserRepository with correct params', async () => {
    const { sut, saveUserRepositorySpy } = makeSut()
    await sut.add('any_email@mail.com', 'any_password', 'any_name')
    expect(saveUserRepositorySpy.email).toBe('any_email@mail.com')
    expect(saveUserRepositorySpy.hash_password).toBe('hashed_password')
    expect(saveUserRepositorySpy.name).toBe('any_name')
  })
  test('Should return null  user  with correct params return', async () => {
    const { sut, saveUserRepositorySpy } = makeSut()
    saveUserRepositorySpy.user = null
    await sut.add('any_email@mail.com', 'any_password', 'any_name')
    expect(sut.user).toBeNull()
  })
  test('Should call Encrypter with correct password  values', async () => {
    const { sut, encrypterSpy } = makeSut()
    await sut.add('valid_email@mail.com', 'valid_password', 'any_name')
    expect(encrypterSpy.value).toBe('valid_password')
    expect(encrypterSpy.base).toBe(10)
  })
  test('Should return throw  if  an invalid password is provided', async () => {
    const { sut, passwordValidatorSpy } = makeSut()
    passwordValidatorSpy.isPasswordValid = false
    const promise = sut.add('any_email@mail.com', 'invalid_password', 'any_name')
    expect(promise).rejects.toThrow(new InvalidParamError('password'))
  })
  test('Should return throw  if  an invalid email is provided', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    emailValidatorSpy.isEmailValid = false
    const promise = sut.add('invalid_email@mail.com', 'any_password', 'any_name')
    expect(promise).rejects.toThrow(new InvalidParamError('email'))
  })
  test('Should throw if invalid dependency are provided', async () => {
    const invalid = {}
    const saveUserRepository = MakeSaveUserRepositorySpy()
    const passwordValidator = MakePasswordValidatorSpy()
    const emailValidator = MakeEmailValidatorSpy()
    const encrypter = MakeEncrypterSpy()
    const suts = [].concat(
      new AddAccountUseCaseSpy(),
      new AddAccountUseCaseSpy({
        saveUserRepository: null,
        passwordValidator: null,
        emailValidator: null,
        encrypter: null
      }),
      new AddAccountUseCaseSpy({
        saveUserRepository: invalid,
        passwordValidator: null,
        emailValidator: null
      }),
      new AddAccountUseCaseSpy({
        saveUserRepository: null,
        passwordValidator: invalid,
        emailValidator: null
      }),
      new AddAccountUseCaseSpy({
        saveUserRepository: null,
        passwordValidator: null,
        emailValidator: invalid
      }),
      new AddAccountUseCaseSpy({
        saveUserRepository: invalid,
        passwordValidator: invalid,
        emailValidator: invalid
      }),
      new AddAccountUseCaseSpy({
        saveUserRepository: invalid,
        passwordValidator: null,
        emailValidator: null
      }),
      new AddAccountUseCaseSpy({
        saveUserRepository,
        passwordValidator,
        emailValidator: invalid
      }),
      new AddAccountUseCaseSpy({
        saveUserRepository,
        passwordValidator,
        emailValidator,
        encrypter: invalid
      }),
      new AddAccountUseCaseSpy({
        saveUserRepository: invalid,
        passwordValidator,
        emailValidator: invalid
      }),
      new AddAccountUseCaseSpy({
        saveUserRepository: invalid,
        passwordValidator: invalid,
        emailValidator
      }),
      new AddAccountUseCaseSpy({
        saveUserRepository: invalid,
        passwordValidator: invalid,
        emailValidator: invalid,
        encrypter
      })

    )
    for (const sut of suts) {
      const promise = sut.add('any_email@mail.com', 'any_password', 'any_name')
      expect(promise).rejects.toThrow()
    }
  })
  test('Should throw if any dependency throws', async () => {
    const saveUserRepository = MakeSaveUserRepositorySpy()
    const passwordValidator = MakePasswordValidatorSpy()
    const emailValidator = MakeEmailValidatorSpy()
    const suts = [].concat(
      new AddAccountUseCaseSpy(),
      new AddAccountUseCaseSpy({
        saveUserRepository,
        passwordValidator: null,
        emailValidator: null
      }),
      new AddAccountUseCaseSpy({
        saveUserRepository: MakeSaveUserRepositoryWithError(),
        passwordValidator,
        emailValidator
      }),
      new AddAccountUseCaseSpy({
        saveUserRepository,
        passwordValidator: MakePasswordValidatorWithError(),
        emailValidator
      }),
      new AddAccountUseCaseSpy({
        saveUserRepository,
        passwordValidator,
        emailValidator: MakeEmailValidatorWithError()
      })
    )
    for (const sut of suts) {
      const promise = sut.add('any_email@mail.com', 'any_password', 'any_name')
      expect(promise).rejects.toThrow()
    }
  })
})
