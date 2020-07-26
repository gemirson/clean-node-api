const { MissingParamError } = require('../../../utils/erros/index')

const MakeEditUserRepository = () => {
  class EditUserRepositorySpy {
    async edit (_Id, name, email) {
      return this.user
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
class EditAccountUseCaseSpy {
  constructor ({ emailValidator, editUserUseCase } = {}) {
    this.emailValidator = emailValidator
    this.editUserUseCase = editUserUseCase
  }

  async edit (_Id, { name, email } = {}) {
    if (!this.emailValidator) {
      throw new MissingParamError('emailValidator class')
    }
    if (!_Id) {
      throw new MissingParamError('_Id')
    }
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!name) {
      throw new MissingParamError('name')
    }
    this.user = await this.editUserUseCase.edit(_Id, name, email)
    return this.user
  }
}
const makeSut = () => {
  const emailValidator = MakeEmailValidatorSpy()
  const editUserRepositorySpy = MakeEditUserRepository()
  const editUserUseCaseSpy = new EditAccountUseCaseSpy({
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
    const sut = new EditAccountUseCaseSpy()
    const promise = sut.edit('valid_Id', {
      name: 'any_name',
      email: 'valid_email@gmail.com'
    })
    expect(promise).rejects.toThrow(new MissingParamError('emailValidator class'))
  })
  test('Should return null if EditUserRepository return null', async () => {
    const { sut, editUserRepositorySpy } = makeSut()
    editUserRepositorySpy.user = null
    const user = await sut.edit('valid_Id', {
      name: 'any_name',
      email: 'valid_email@gmail.com'
    })
    expect(user).toBeNull()
  })
})
