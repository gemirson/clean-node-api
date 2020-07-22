const AddAccountRoute = require('../../presentation/routes/add-account-user-router')
const SaveUserRepository = require('../../infra/repositories/save-user-repository')
const AddAccountUseCase = require('../../domain/UseCase/account/add-account-usecase')
const EmailValidator = require('../../domain/validate/email-validator')
const Encrypter = require('../../domain/validate/encrypter')
const PasswordValidator = require('../../utils/helpers/password-validator-user')

module.exports = class AddAccountRouterCompose {
  static compose () {
    const passwordValidator = new PasswordValidator()
    const emailValidator = new EmailValidator()
    const encrypter = new Encrypter()
    const saveUserRepository = new SaveUserRepository()

    const addAccountUseCase = new AddAccountUseCase({
      saveUserRepository: saveUserRepository,
      passwordValidator: passwordValidator,
      emailValidator: emailValidator,
      encrypter: encrypter
    })

    return new AddAccountRoute({
      addAccountUseCase: addAccountUseCase,
      passwordValidator: passwordValidator,
      emailValidator: emailValidator
    })
  }
}
