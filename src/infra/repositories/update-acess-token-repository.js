const MissingParamError = require('../../utils/erros/missing-param-error')
const MongoHelper = require('../../infra/helpers/mongo-helper')

module.exports = class UpdateAcessTokenRepository {
  async update (userId, acessToken) {
    if (!userId) {
      throw new MissingParamError('userId')
    }
    if (!acessToken) {
      throw new MissingParamError('acessToken')
    }
    const db = await MongoHelper.getDb()
    await db.collection('users').updateOne({ _id: userId }
      , {
        $set: {
          acessToken
        }
      })
  }
}
