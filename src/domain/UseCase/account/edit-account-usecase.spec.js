const { MissingParamError } = require('../../../utils/erros/index')

class EditAccountUseCaseSpy {
  async edit (_Id, { name, email } = {}) {
    this._Id = _Id
    this.name = name
    this.email = email
    if (!email) {
      return new MissingParamError('email')
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
    const promise = sut.edit()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
})
