const request = require('supertest')
let app

describe('Content Type Middleware', () => {
  beforeEach(() => {
    jest.resetModules()
    app = require('../config/app')
  })
  test('Should return json content-type as default', async () => {
    await app.get('test_content_type', async (req, res) => {
      res.send('')
    })

    request(app)
      .get('/test_content_type')
      .expect('content-type', /json/)
  })

  test('Should return xml content-type is forced', async () => {
    await app.get('test_content_type', async (req, res) => {
      res.type('xml')
      res.send('')
    })

    request(app)
      .get('/test_content_type')
      .expect('content-type', /xml/)
  })
})
