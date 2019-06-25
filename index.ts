import * as config from './src/config'
import http from 'http'

import app from './src/server'

const httpServer: http.Server = http.createServer(app)
httpServer.listen(config.PORT, () => {
  console.log(`listening on port: ${config.PORT}`)
})
