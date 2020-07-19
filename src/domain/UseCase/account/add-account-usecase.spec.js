const { MissingParamError } = require('../../../utils/erros')

jest.mock('bcrypt', () => ({
  isValid: true,
  async hash (value) {
    this.value = value
    return this.isValid
  }
})
)
class AddAccountUseCase {
  constructor ({ saveUserRepository } = {}) {
    this.saveUserRepository = saveUserRepository
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
    this.user = await this.saveUserRepository.save(email, password, name)
    if (!this.user) {
      return null
    }
    return this.user
  }
}
class Encrypter {
  static async hash (value) {
    this.has_value = 'any_hash'
    this.value = value
    return this.has_value
  }
}

class SaveUserRepositorySpy {
  async save (email, password, name) {
    this.email = email
    this.password = password
    this.name = name
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }
    if (!name) {
      throw new MissingParamError('name')
    }
    this.has_password = await Encrypter.hash(password)
    if (!this.has_password) {
      return MissingParamError('has_password')
    }
    return this.user
  }
}

const makeSut = () => {
  const saveUserRepositorySpy = new SaveUserRepositorySpy()
  const sut = new AddAccountUseCase({
    saveUserRepository: saveUserRepositorySpy
  })

  return {
    sut,
    saveUserRepositorySpy
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
    expect(saveUserRepositorySpy.password).toBe('any_password')
    expect(saveUserRepositorySpy.name).toBe('any_name')
  })

  test('Should return null  user  with correct params return', async () => {
    const { sut, saveUserRepositorySpy } = makeSut()
    saveUserRepositorySpy.user = null
    await sut.add('any_email@mail.com', 'any_password', 'any_name')
    expect(sut.user).toBeNull()
  })
})
