const MongoHelper = require('../../infra/helpers/mongo-helper')
const MissingParamError = require('../../utils/erros/missing-param-error')
const UpdateAcessTokenRepository = require('./update-acess-token-repository')

let userModel,fakeUserId

const makeSut = () => {
  return new UpdateAcessTokenRepository()
}

describe('Auth UseCase', () => {
 
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    userModel = await MongoHelper.getCollection('users')
  })

  beforeEach(async () => {
    await userModel.deleteMany()
    const fakeUser = await userModel.insertOne({
      email: 'valid_email@mail.com',
      password: 'hashed_password',
      name: 'any_name'
    })
    fakeUserId = fakeUser.ops[0]._id
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should update the user with given acessToken', async () => {
    const sut = makeSut()
    await sut.update(fakeUserId, 'valid_token')
    const updateFakeUser = await userModel.findOne({ _id: fakeUserId })
    expect(updateFakeUser.acessToken).toBe('valid_token')
  })

  test('Should throw if no params is provided', async () => {
    const sut = makeSut()
    expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
    expect(sut.update(fakeUserId)).rejects.toThrow(new MissingParamError('acessToken'))
  })
})
