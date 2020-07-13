module.exports = class InvalidParamError extends Error {
  constructor (paraName) {
    super(`Invalid param: ${paraName}`)
    this.name = 'InvalidParamError'
  }
}
