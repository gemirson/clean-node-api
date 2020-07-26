const { MissingParamError } = require('../../../utils/erros/index')
const EditAccountUseCase = require('./edit-account-usecase')
const MakeEditUserRepository = () => {
  class EditUserRepositorySpy {
    async edit (_Id, name, email) {
      this._Id = _Id
      this.name = name
      this.email = email
      if (!this.user) {
        return {
          _Id: this._Id,
          name: this.name,
          email: this.email
        }
      }
      return null
    }
  }
  const editUserRepositorySpy = new EditUserRepositorySpy()
  return editUserRepositorySpy
}

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
    async isValid () {
      throw new Error()
    }
  }
  return new EmailValidatorWithError()
}

const MakeEditUserRepositoryWithError = () => {
  class EditAccountUseCaseSpyWithError {
    async edit (_Id, { name, email } = {}) {
      throw new Error()
    }
  }
  return new EditAccountUseCaseSpyWithError()
}
const makeSut = () => {
  const emailValidator = MakeEmailValidatorSpy()
  const editUserRepositorySpy = MakeEditUserRepository()
  const editUserUseCaseSpy = new EditAccountUseCase({
    emailValidator: emailValidator,
    editUserUseCase: editUserRepositorySpy
  })
  return {
    sut: editUserUseCaseSpy,
    editUserRepositorySpy: editUserRepositorySpy
  }
}

describe('Edit account user', () => {
  test('Should return throw if no email is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.edit('valid_Id', {
      name: 'any_name'
    })
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
  test('Should return throw if no name is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.edit('valid_Id', {
      email: 'valid_email@gmail.com'
    })
    expect(promise).rejects.toThrow(new MissingParamError('name'))
  })
  test('Should return throw if no Id is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.edit()
    expect(promise).rejects.toThrow(new MissingParamError('_Id'))
  })

  test('Should return throw if no emailValidator is provided', async () => {
    const sut = new EditAccountUseCase()
    const promise = sut.edit('valid_Id', {
      name: 'any_name',
      email: 'valid_email@gmail.com'
    })
    expect(promise).rejects.toThrow(new MissingParamError('emailValidator class'))
  })
  test('Should return null if EditUserRepository return null', async () => {
    const { sut, editUserRepositorySpy } = makeSut()
    editUserRepositorySpy.user = {}
    const user = await sut.edit('valid_Id', {
      name: 'any_name',
      email: 'valid_email@gmail.com'
    })
    expect(user).toBeNull()
  })
  test('Should return user if when call EditUserRepository with params corrects', async () => {
    const { sut } = makeSut()
    const user = await sut.edit('valid_Id', {
      name: 'any_name',
      email: 'valid_email@gmail.com'
    })
    expect(user._Id).toBe('valid_Id')
    expect(user.email).toBe('valid_email@gmail.com')
    expect(user.name).toBe('any_name')
  })
  test('Should throw if invalid dependency are provided', async () => {
    const invalid = {}
    const editUserRepository = MakeEditUserRepository()
    const emailValidator = MakeEmailValidatorSpy()
    const suts = [].concat(
      new EditAccountUseCase(),
      new EditAccountUseCase({
        editUserRepository: null,
        emailValidator: null
      }),
      new EditAccountUseCase({
        editUserRepository: invalid,
        emailValidator: null
      }),
      new EditAccountUseCase({
        editUserRepository,
        emailValidator: null
      }),
      new EditAccountUseCase({
        editUserRepository: invalid,
        emailValidator
      })
    )
    for (const sut of suts) {
      const promise = sut.edit('_Id', 'any_email@mail.com', 'any_name')
      expect(promise).rejects.toThrow()
    }
  })
  test('Should throw if any dependency throws', async () => {
    const editUserRepository = MakeEditUserRepository()
    const emailValidator = MakeEmailValidatorSpy()
    const suts = [].concat(
      new EditAccountUseCase(),
      new EditAccountUseCase({
        editUserRepository,
        emailValidator: null
      }),
      new EditAccountUseCase({
        editUserRepository: MakeEditUserRepositoryWithError(),
        emailValidator
      }),
      new EditAccountUseCase({
        editUserRepository,
        emailValidator: MakeEmailValidatorWithError()
      })
    )
    for (const sut of suts) {
      const promise = sut.edit('_Id', 'any_email@mail.com', 'any_name')
      expect(promise).rejects.toThrow()
    }
  })
})
