const { MissingParamError } = require('../../../utils/erros')

class AddAccountUseCase {
  async add (email) {
    if (!email) {
      throw new MissingParamError('email')
    }

    return true
  }
}

const makeSut = () => {
  const sut = new AddAccountUseCase()
  return {
    sut
  }
}

describe('AddAccount ', () => {
  test('Should return throw if no email is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.add()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
})
