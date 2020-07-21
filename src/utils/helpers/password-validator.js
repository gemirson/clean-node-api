const { MissingParamError } = require('../erros')
const passwordValidator = require('password-validator')

module.exports = class PasswordValidator {
  isValid (password) {
    this.password = password
    if (!password) {
      throw new MissingParamError('password')
    }
    return passwordValidator.validate(this.password)
  }
}
