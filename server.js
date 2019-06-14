const config = require('./src/config')
const { ApolloServer } = require('apollo-server-express')
const mongoose = require('mongoose')
const express = require('express')

const authService = require('./src/services/authService')
const { typeDefs, resolvers } = require('./src/graphql/schema')
const path = require('path')

console.log('connecting to', config.MONGODB_URI)

const app = express()
app.use(express.static(path.join(__dirname, 'build')))

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch(error => {
    console.error('Error connecting: ', error.message)
  })

const server = new ApolloServer({
  typeDefs,
  resolvers,
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
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.listen(config.PORT, () => console.log(`listening on port: ${config.PORT}`))
