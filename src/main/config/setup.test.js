const request = require('supertest')
const app = require('./aṕp')

describe('App Setup', () => {
  test('Should disable x-powered-by header', async () => {
    app.get('test_x_powered_by', (req, res) => {
      res.send('')
    })

    const res = await request(app).get('/test_x_powered_by')
    expect(res.header['x-powered-by']).toBeUndefined()
  })

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
