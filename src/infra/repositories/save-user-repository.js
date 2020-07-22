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
    const userModel = await MongoHelper.getCollection('users')
    const newUser = await userModel.insertOne({
      email: email,
      password: hashpassword,
      name: name
    })
    this.user = {
      _id: newUser.ops[0]._id,
      name: newUser.ops[0].name,
      email: newUser.ops[0].email
    }
    return this.user
  }
}
