const request = require('supertest')
const app = require('../config/app')
const MongoHelper = require('../../infra/helpers/mongo-helper')
const bcrypt = require('bcrypt')

let userModel

describe('Login Routes', () => {
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

  test('Should return 200 when valid credentails are provided', async () => {
    await userModel.insertOne({
      email: 'valid_email@mail.com',
      password: bcrypt.hash('hashed_password', 10)

    })
    request(app)
      .post('/api/login')
      .send({
        email: 'valid_email@mail.com',
        password: bcrypt.hash('hashed_password', 10)
      })
      .expect(200)

    console.log(await bcrypt.hash('hashed_password', 10))
  })
  test('Should return 401 when invalid credentails are provided', async () => {
    await userModel.insertOne({
      email: 'valid_email@mail.com',
      password: 'hashed_password'

    })
    request(app)
      .post('/api/login')
      .send({
        email: 'valid_email@mail.com',
        password: 'hashed_password_1'
      })
      .expect(401)
  })
})
