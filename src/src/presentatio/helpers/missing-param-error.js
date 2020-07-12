module.exports = class MissingError extends Error {
  constructor (paraName) {
    super(`Missing param: ${paraName}`)
    this.name = 'MissingParamError'
  }
}
