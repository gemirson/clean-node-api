const cors = require('../middlewares/cors')
// const jsonParser = require('../middlewares/json-parser')
const contentType = require('../middlewares/conten-type')
const bodyParser = require('body-parser')

module.exports = app => {
  app.disable('x-powered-by')
  app.use(cors)
  app.use(bodyParser.urlencoded({
    extended: true
  }))
  app.use(bodyParser.json())
  app.use(contentType)
}
