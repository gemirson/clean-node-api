const SaveUserRepository = require('./save-user-repository')
const MongoHelper = require('../../infra/helpers/mongo-helper')
const { MissingParamError } = require('../../utils/erros/index')

let userModel

const makeSut = () => {
  return new SaveUserRepository()
}

describe('Save user use case', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    userModel = await MongoHelper.getCollection('users')
  })

  beforeEach(async () => {
    await userModel.deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  test('Should throw if no email is provided', async () => {
    const sut = makeSut()
    const promise = sut.save()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
  test('Should throw if no password is provided', async () => {
    const sut = makeSut()
    const promise = sut.save('valid_email@mail.com')
    expect(promise).rejects.toThrow(new MissingParamError('hashpassword'))
  })
  test('Should throw if no name is provided', async () => {
    const sut = makeSut()
    const promise = sut.save('valid_email@mail.com', 'valid_password')
    expect(promise).rejects.toThrow(new MissingParamError('name'))
  })
  test('Should return  user  if  sucess creating user', async () => {
    const sut = makeSut()
    const user = await sut.save('valid_email@mail.com', 'valid_password', 'any_name')
    expect(user.name).toBe('any_name')
    expect(user.email).toBe('valid_email@mail.com')
  })
})
