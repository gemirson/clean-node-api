const MissingError = require('./missing-param-error')
const Unauthorized = require('./unauthorized-error')
const ServerError = require('./server-error ')

module.exports = class httpResponse {
  static badRequest (paraName) {
    return {
      statusCode: 400,
      body: new MissingError(paraName)
    }
  }

  static serverError () {
    return {
      statusCode: 500,
      body: new ServerError()
    }
  }

  static unauthorizedError () {
    return {
      statusCode: 401,
      body: new Unauthorized()
    }
  }

  static ok (data) {
    return {
      statusCode: 200,
      body: data
    }
  }
}
