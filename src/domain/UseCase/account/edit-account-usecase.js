const MissingParamError = require('../../../utils/erros/missing-param-error')

module.exports = class EditAccountUseCase {
  constructor ({ emailValidator, editUserUseCase } = {}) {
    this.emailValidator = emailValidator
    this.editUserUseCase = editUserUseCase
  }

  async edit (_Id, { name, email } = {}) {
    if (!this.emailValidator) {
      throw new MissingParamError('emailValidator class')
    }
    if (!_Id) {
      throw new MissingParamError('_Id')
    }
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!name) {
      throw new MissingParamError('name')
    }
    this.user = await this.editUserUseCase.edit(_Id, name, email)
    if (this.user) {
      return this.user
    }
    return null
  }
}
