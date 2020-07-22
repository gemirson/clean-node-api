const request = require('supertest')
const app = require('../config/app')
const MongoHelper = require('../../infra/helpers/mongo-helper')
let userModel

describe('Creat new user Routes', () => {
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

  test('Should return 201 when params are provided', async () => {
    request(app)
      .post('/api/account/add')
      .send({
        email: 'valid_email@mail.com',
        password: 'valid_password',
        name: 'valid_name'
      })
      .expect(201)
  })

  test('Should return 500 if no params are provided', async () => {
    request(app)
      .post('/api/account/add')
      .send()
      .expect(500)
  })
})
