const loginRouter = require('../compose/login-route-compose')
const ExpressRouterAdapter = require('../adapter/express-router-adapter')
module.exports = router => {
 
  router.post('/login', ExpressRouterAdapter.adapt(loginRouter))

}
