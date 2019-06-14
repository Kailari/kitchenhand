const config = require('./src/config')
const { ApolloServer } = require('apollo-server')
const mongoose = require('mongoose')

const authService = require('./src/services/authService')
const { typeDefs, resolvers } = require('./src/graphql/schema')

console.log('connecting to', config.MONGODB_URI)

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

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
