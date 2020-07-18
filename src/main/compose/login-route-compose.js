const LoginRouter = require('../../presentation/routes/login-router')
const AuthUseCase = require('../../domain/UseCase/auth-usecase')
const EmailValidator = require('../../domain/validate/email-validator')
const LoadByEmailRepository = require('../../infra/repositories/load-user-by-email-repository')
const UpdateAcessTokenRepository = require('../../infra/repositories/update-acess-token-repository')
const Encrypter = require('../../domain/validate/encrypter')
const TokenGenerator = require('../../utils/helpers/token-generator')
const env = require('../config/env')


loadByEmailRepository = new LoadByEmailRepository()
updateAcessTokenRepository = new UpdateAcessTokenRepository()
encrypter = new Encrypter()
tokenGenerator = new TokenGenerator(env.tokenSecret)
emailValidator = new EmailValidator()

authUseCase = new AuthUseCase({
  authUseCase,
  updateAcessTokenGenerator,
  encrypter,
  tokenGenerator
})

const loginRouter = new LoginRouter({
  authUseCase,
  emailValidator
})

module.exports = loginRouter 
