const sut = require('./mongo-helper')

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  test('Should reconnect when getCollection() is invoked and client is disconnect', async () => {
    expect(sut.db).toBeTruthy()
    await sut.disconnect()
    expect(sut.db).toBeFalsy()
    await sut.getCollection('users')
    expect(sut.db).toBeTruthy()
  })

  test('Should reconnect when getCollection() is invoked and client is disconnect', async () => {
    expect(sut.db).toBeTruthy()
    await sut.disconnect()
    expect(sut.db).toBeFalsy()
    await sut.getCollection('users')
    expect(sut.db).toBeTruthy()
  })
  test('Should return null if params are provided', async () => {
    const user = {
      email: 'valid_email@gmail',
      password: 'valid_password',
      name: 'valid_name'
    }
    const resultUser = await sut.save('valid_email@gmail', 'valid_password', 'valid_name')
    expect(resultUser.email).toBe(user.email)
    expect(resultUser.name).toBe(user.name)
  })
})
