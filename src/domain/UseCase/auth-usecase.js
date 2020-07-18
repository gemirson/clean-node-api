const { MissingParamError } = require('../../utils/erros')

module.exports = class AuthUsecase {
  constructor ({ loadUserByEmailRepository, updateAcessTokenGenerator, encrypter, tokenGenerator } = {}) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
    this.updateAcessTokenGenerator = updateAcessTokenGenerator
    this.encrypter = encrypter
    this.tokenGenerator = tokenGenerator
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }
    const user = await this.loadUserByEmailRepository.load(email)
    const isValid = user && await this.encrypter.compare(password, user.password)
    if (isValid) {
      const acessToken = await this.tokenGenerator.generate(user._id)
      await this.updateAcessTokenGenerator.update(user._id, acessToken)
      return acessToken
    }
    return null
  }
}
