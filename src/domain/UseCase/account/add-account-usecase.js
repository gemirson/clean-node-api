const { MissingParamError, InvalidParamError } = require('../../../utils/erros')

module.exports = class AddAccountUseCase {
  constructor ({ saveUserRepository, passwordValidator, emailValidator, encrypter } = {}) {
    this.saveUserRepository = saveUserRepository
    this.passwordValidator = passwordValidator
    this.emailValidator = emailValidator
    this.encrypter = encrypter
  }

  async add (email, password, name) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }
    if (!name) {
      throw new MissingParamError('name')
    }
    if (!this.passwordValidator.isPassword(password)) {
      throw new InvalidParamError('password')
    }
    if (!this.emailValidator.isValid(email)) {
      throw new InvalidParamError('email')
    }
    this.has_password = await this.encrypter.hash(password, 10)
    this.user = await this.saveUserRepository.save(email, this.has_password, name)
    const isValid = this.user && this.passwordValidator.isPassword(password) &&
    this.emailValidator.isValid(email)
    if (isValid) {
      return this.user
    }
    return null
  }
}
