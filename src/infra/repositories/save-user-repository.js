const { MissingParamError } = require('../../utils/erros')
const MongoHelper = require('../../infra/helpers/mongo-helper')

module.exports = class SaveUserRepository {
  async save (email, hashpassword, name) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!hashpassword) {
      throw new MissingParamError('hashpassword')
    }
    if (!name) {
      throw new MissingParamError('name')
    }
    this.user = await MongoHelper.save(email, hashpassword, name)
    return this.user
  }
}
