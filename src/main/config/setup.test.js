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
})
