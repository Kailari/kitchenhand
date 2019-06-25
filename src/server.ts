import * as config from './config';
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import mongoose from 'mongoose'
import path from 'path'

import { IUser } from './models/User'
import { sslRedirect } from './middleware';
import authService from './services/authService';
import schema from './graphql/schema'

export interface Context {
  currentUser: IUser | null,
}

console.log('connecting to', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch(error => {
    console.error('Error connecting: ', error.message)
  })

const app: express.Application = express()
//app.use(sslRedirect(['production']))
app.use(express.static(path.join(__dirname, config.STATIC_FILE_PATH)))

const server = new ApolloServer({
  schema,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null

    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const tokenString = auth.substring(7)
      const currentUser = await authService.getUserFromToken(tokenString)
      return { currentUser }
    }
  }
})
server.applyMiddleware({ app })
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, config.STATIC_FILE_PATH, 'index.html'))
})

export default app
