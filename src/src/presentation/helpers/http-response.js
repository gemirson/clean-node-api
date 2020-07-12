const MissingError = require('./missing-param-error')

module.exports = class httpResponse {
  static badRequest (paraName) {
    return {
      statusCode: 400,
      body: new MissingError(paraName)
    }
  }

  static serverError () {
    return {
      statusCode: 500
    }
  }
}
