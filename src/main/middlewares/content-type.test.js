const request = require('supertest')
const app = require('../config/app')

describe('Content Type Middleware', () => {
  test('Should return json content-type as default', async () => {
    app.get('test_content_type', async (req, res) => {
      res.send('')
    })

    request(app)
      .post('/test_content_type')
      .expect('content-type', /json/)
  })

  test('Should return xml content-type is forced', async () => {
    app.get('test_content_type_xml', async (req, res) => {
      res.send('')
    })

    request(app)
      .post('/test_content_type_xml')
      .expect('content-type', /xml/)
  })
})
