const { MongoClient } = require('mongodb')

module.exports = {
  async connect (uri) {
    this.uri = uri
    this.client = await MongoClient.connect(this.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    this.db = await this.client.db()
  },
  async  disconnect () {
    await this.client.close()
    this.client = null
    this.db = null
  },
  async getCollection (name) {
    this.namedb = name
    if (!this.client || !this.client.isConnected()) {
      await this.connect(this.uri)
    }
    return this.db.collection(name)
  },
  async save (email, haspassword, name) {
    const userModel = this.db.collection(this.namedb)
    const newUser = await userModel.insertOne({
      email: email,
      password: haspassword,
      name: name
    })
    return {
      _id: newUser.ops[0]._id,
      name: newUser.ops[0].name,
      email: newUser.ops[0].email
    }
  }
}
