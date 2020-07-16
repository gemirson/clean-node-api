const request = require('supertest')
const app = require('../config/app')

describe('Cors', () => {
  test('Should enable CORS', async () => {
    app.get('test_cors', (req, res) => {
      res.send('')
    })

    const res = await request(app).get('/test_cors')
    expect(res.header['acess-control-allow-orign']).toBe('*')
    expect(res.header['acess-control-allow-methods']).toBe('*')
    expect(res.header['acess-control-allow-headers']).toBe('*')
  })
})
