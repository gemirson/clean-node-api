const { MissingParamError } = require('../erros')
const PasswordValidator = require('password-validator')

module.exports = class UserPasswordValidator {
  async isValid (password) {
    this.password = password
    if (!password) {
      throw new MissingParamError('password')
    }
    var schema = new PasswordValidator()
    schema
      .is().min(8)
      .is().max(100)
      .has().uppercase()
      .has().lowercase()
      .has().digits()
      .has().not().spaces()
      .is().not().oneOf(['Passw0rd', 'Password123'])
    return schema.validate(this.password)
  }
}
