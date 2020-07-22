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
    const resultValidate = await this.passwordValidator.isValid(password)
    console.log(resultValidate)
    if (!resultValidate) {
      throw new InvalidParamError('password')
    }
    if (!this.emailValidator.isValid(email)) {
      throw new InvalidParamError('email')
    }
    this.has_password = await this.encrypter.hashSync(password, 10)
    this.user = await this.saveUserRepository.save(email, this.has_password, name)
    console.log(this.user)
    if (this.user) {
      return this.user
    }
    return null
  }
}
