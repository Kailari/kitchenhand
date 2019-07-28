import config from './config'
import http from 'http'

import app, { connectMongo } from './server'

connectMongo()
const httpServer: http.Server = http.createServer(app)
httpServer.listen(config.PORT, (): void => {
  console.log(`listening on port: ${config.PORT}`)
})
