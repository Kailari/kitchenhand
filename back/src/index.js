require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { ApolloServer, UserInputError, gql } = require('apollo-server')
const mongoose = require('mongoose')
const User = require('./models/User')

mongoose.set('useFindAndModify', false)
const MONGODB_URI = process.env.DATABASE_URL
const JWT_SECRET = process.env.JWT_SECRET

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch(error => {
    console.error('Error connecting: ', error.message)
  })

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
  }

  type Token {
    value: String!
  }

  type Error {
    path: String!
    message: String
  }

  type RegisterResponse {
    ok: Boolean!
    user: User
    errors: [Error!]
  }

  type Query {
    userCount: Int!
    allUsers: [User!]!
    findUser(id: ID!): User
    me: User
  }

  type Mutation {
    registerUser(
      name: String!
      loginname: String!
      password: String!
    ): User
    login(
      loginname: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Query: {
    userCount: () => User.collection.countDocuments(),
    allUsers: () => User.find({}),
    findUser: (root, args) => User.findById(args.id),
    me: (root, args, context) => context.currentUser
  },
  Mutation: {
    registerUser: async (root, args) => {
      // TODO: validate password

      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(args.password, saltRounds)

      const user = new User({
        name: args.name,
        loginname: args.loginname,
        password: hashedPassword
      })

      try {
        await user.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: Object.keys(error.errors)
        })
      }

      return user
    },
    login: async (root, args) => {
      // TODO: Return all errors at once

      if (!args.loginname || args.loginname === '') {
        throw new UserInputError('`loginname` is required', { invalidArgs: 'loginname' })
      }

      if (!args.password || args.password === '') {
        throw new UserInputError('`password` is required', { invalidArgs: 'password' })
      }

      const user = await User.findOne({ loginname: args.loginname })
      const correctPassword = user === null
        ? false
        : await bcrypt.compare(args.password, user.password)

      if (!correctPassword) {
        throw new UserInputError('Bad loginname or password', { invalidArgs: ['loginname', 'password'] })
      }

      const tokenUser = {
        loginname: user.loginname,
        id: user._id
      }

      return { value: jwt.sign(tokenUser, JWT_SECRET) }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null

    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET)

      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
