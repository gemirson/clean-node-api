const AddAccountRouterCompose = require('../../main/compose/add-account-compose')
const { adapt } = require('../adapter/express-router-adapter')
module.exports = router => {
  router.post('/account/add', adapt(AddAccountRouterCompose.compose()))
}
