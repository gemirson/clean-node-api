const { MissingParamError } = require('../../utils/erros')
const MongoHelper = require('../../infra/helpers/mongo-helper')

module.exports = class LoadUserByEmailRepository {
  async load (email) {
    if (!email) {
      throw new MissingParamError('email')
    }
    const db = await MongoHelper.getDb()
    const user = db.collection('users').findOne(
      {
        email
      },
      {
        projection: {
          password: 1
        }
      }
    )
    return user
  }
}
