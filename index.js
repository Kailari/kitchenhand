const config = require('./src/config')
const http = require('http')

const app = require('./src/server')

const httpServer = http.createServer(app)
httpServer.listen(config.PORT, () => {
  console.log(`listening on port: ${config.PORT}`)
})