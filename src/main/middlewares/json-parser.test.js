const request = require('supertest')
const app = require('../config/app')

describe('Body Parser(Json Parser) Middleware', () => {
  test('Should body parser as JSON', async () => {
    await app.post('test_json_parser', async (req, res) => {
      res.json(req.body)
    })

    request(app)
      .post('/test_json_parser')
      .send({ name: 'valid' })
      .expect({ name: 'valid' })
  })
})
