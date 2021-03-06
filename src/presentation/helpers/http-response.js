const { ServerError, UnauthorizedError } = require('../erros')

module.exports = class HttpResponse {
  static badRequest (error) {
    return {
      statusCode: 400,
      body: {
        error: error.message
      }
    }
  }

  static serverError () {
    return {
      statusCode: 500,
      body: { error: new ServerError().message }

    }
  }

  static unauthorizedError () {
    return {
      statusCode: 401,
      body: {
        error: new UnauthorizedError().message
      }
    }
  }

  static ok (body) {
    return {
      statusCode: 200,
      body
    }
  }

  static Created (body) {
    return {
      statusCode: 201,
      body
    }
  }
}
