const router = require('express').router()
const fb = require('fast-glob')

module.exports = app => {
  app.use('/api', router)
  fb.sync('**/src/main/routes/**j.s').forEach(file => require(`../../../${file}`)(router))
}
