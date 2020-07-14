module.exports = class MissingParamError extends Error {
  constructor (paraName) {
    super(`Missing param: ${paraName}`)
    this.name = 'MissingParamError'
  }
}
