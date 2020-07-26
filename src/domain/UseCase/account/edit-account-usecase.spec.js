const { MissingParamError } = require('../../../utils/erros/index')

class EditAccountUseCaseSpy {
  async edit (_Id, { name, email } = {}) {
    this._Id = _Id
    this.name = name
    this.email = email
    if (!_Id) {
      throw new MissingParamError('_Id')
    }
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!name) {
      throw new MissingParamError('name')
    }
    return this.user
  }
}
const makeSut = () => {
  const editUserUseCaseSpy = new EditAccountUseCaseSpy()
  return {
    sut: editUserUseCaseSpy
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
})
