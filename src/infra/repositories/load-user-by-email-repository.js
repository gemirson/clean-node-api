const { MissingParamError } = require('../../utils/erros')

module.exports = class LoadUserByEmailRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async load (email) {
    if (!email) {
      throw new MissingParamError('email')
    }
    const user = this.userModel.findOne(
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