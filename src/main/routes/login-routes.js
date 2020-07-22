const LoginRouterCompose = require('../compose/login-route-compose')
const { adapt } = require('../adapter/express-router-adapter')
module.exports = router => {
  router.post('/login', adapt(LoginRouterCompose.compose()))
}
