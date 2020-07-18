const LoginRouter = require('../../presentation/routes/login-router')
const AuthUseCase = require('../../domain/UseCase/auth-usecase')
const EmailValidator = require('../../domain/validate/email-validator')
const LoadByEmailRepository = require('../../infra/repositories/load-user-by-email-repository')
const UpdateAcessTokenRepository = require('../../infra/repositories/update-acess-token-repository')
const Encrypter = require('../../domain/validate/encrypter')
const TokenGenerator = require('../../utils/helpers/token-generator')
const env = require('../config/env')

module.exports = class LoginRouterCompose {
  static compose () {
    const tokenGenerator = new TokenGenerator(env.tokenSecret)
    const encrypter = new Encrypter()
    const loadByEmailRepository = new LoadByEmailRepository()
    const updateAcessTokenRepository = new UpdateAcessTokenRepository()
    const emailValidator = new EmailValidator()

    const authUseCase = new AuthUseCase({
      loadByEmailRepository,
      updateAcessTokenRepository,
      encrypter,
      tokenGenerator
    })

    return new LoginRouter({
      authUseCase,
      emailValidator
    })
  }
}
