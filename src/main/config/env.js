module.exports = {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:xxxx/clan-node-api',
  tokenSecret:process.env.TOKEN_SECRET || 'secret'
}
