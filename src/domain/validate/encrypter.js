const bcrypt = require('bcrypt')
const { MissingParamError } = require('../../utils/erros')

module.exports = class Encrypter {
  async compare (value, hash) {
    if (!value) {
      throw new MissingParamError('value')
    }
    if (!hash) {
      throw new MissingParamError('hash')
    }
    const isValid = await bcrypt.compare(value, hash)
    return isValid
  }

  async hashSync (value, base) {
    if (!value) {
      throw new MissingParamError('value')
    }
    if (!base) {
      throw new MissingParamError('hash')
    }
    const hashResult = await bcrypt.hashSync(value, base)
    return hashResult
  }
}
