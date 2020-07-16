const MongoHelper = require('../../infra/helpers/mongo-helper')
let db
class UpdateAcessTokenRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async update (userId, acessToken) {
    await this.userModel.updateOne({ _id: userId }
      , {
        $set: {
          acessToken
        }
      })
  }
}

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new UpdateAcessTokenRepository(userModel)
  return {
    userModel,
    sut
  }
}
describe('Auth UseCase', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    db = await MongoHelper.getDb()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should update the user with given acessToken', async () => {
    const { sut, userModel } = makeSut()
    const fakeUser = await userModel.insertOne({
      email: 'valid_email@mail.com',
      password: 'hashed_password',
      name: 'any_name'
    })
    await sut.update(fakeUser.ops[0]._id, 'valid_token')
    const updateFakeUser = await userModel.findOne({ _id: fakeUser.ops[0]._id })
    expect(updateFakeUser.acessToken).toBe('valid_token')
  })

  test('Should throw if no userModel is provided', async () => {
    const userModel = db.collection('users')
    const sut = new UpdateAcessTokenRepository()
    const fakeUser = await userModel.insertOne({
      email: 'valid_email@mail.com',
      password: 'hashed_password',
      name: 'any_name'
    })
    const promise = sut.update(fakeUser.ops[0]._id, 'valid_token')
    expect(promise).rejects.toThrow()
  })
})
