const loginRouter = require('../compose/login-route-compose')

module.exports = router => {
 
  router.post('/login', loginRouter)

}
