const express = require('express')
const app = express()

app.get('/api', (req, res) => {
  res.send('api')
})
app.listen(5858, () => { console.log('Server Running') })
