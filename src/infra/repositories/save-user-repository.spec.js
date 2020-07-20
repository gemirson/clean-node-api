const SaveUserRepository = require('./save-user-repository')
const MongoHelper = require('../../infra/helpers/mongo-helper')
const { MissingParamError } = require('../../utils/erros/index')

let userModel

const makeSut = () => {
  return new SaveUserRepository()
}

describe('Descrive test', () => {
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
  test('Should return null if user not creating ', async () => {
    const sut = makeSut()
    const user = await sut.save('valid_email@mail.com', 'valid_password', 'any_name')
    expect(user).toBeNull()
  })
  test('Should throw if no email is provided', async () => {
    const sut = makeSut()
    const promise = sut.save()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
})
