const { MissingParamError } = require('../../utils/erros')

module.exports = class AuthUsecase {
  constructor (loadUseByEmailRepository, encrypter, tokenGeneratorSpy) {
    this.loadUseByEmailRepository = loadUseByEmailRepository
    this.encrypter = encrypter
    this.tokenGeneratorSpy = tokenGeneratorSpy
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }
    const user = await this.loadUseByEmailRepository.load(email)
    if (!user) {
      return null
    }
    const isValid = await this.encrypter.compare(password, user.password)
    if (!isValid) {
      return null
    }
    await this.tokenGeneratorSpy.generate(user.id)
  }
}
