const config = require('./config')
const { ApolloServer, UserInputError, gql } = require('apollo-server')
const mongoose = require('mongoose')

const authService = require('./services/authService')

console.log('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
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

  type Ingredient {
    id: ID!
    name: String!
  }

  type Unit {
    id: ID!
    name: String!
    abbreviation: String!
  }

  type RecipeIngredient {
    id: ID!
    ingredient: Ingredient!
    amount: Float!
    unit: Unit!
  }

  type Recipe {
    id: ID!
    name: String!
    ingredients: [RecipeIngredient!]!
  }

  type Query {
    userCount: Int!
    allUsers: [User!]!
    findUser(id: ID!): User
    me: User

    allRecipes: [Recipe!]!
    recipe(id: ID!): Recipe
    myRecipes: [Recipe!]!
    userRecipes(id: ID!): [Recipe!]!
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

    addRecipe(
      name: String!
    ): Recipe
    removeRecipe(
      id: ID!
    ): Recipe
  }
`

const resolvers = {
  Query: {
    userCount: () => authService.userCount(),
    allUsers: () => authService.getAll(),
    findUser: (root, args) => {
      if (!args.id) {
        throw new UserInputError('`id` is required', { invalidArgs: 'id' })
      }

      authService.find(args.id)
    },
    me: (root, args, context) => context.currentUser
  },
  Mutation: {
    registerUser: async (root, args) => {
      try {
        await authService.register(args.name, args.loginname, args.password)
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: Object.keys(error.errors)
        })
      }
    },
    login: async (root, args) => {
      let errors = []

      if (!args.loginname || args.loginname === '') {
        errors.push({ message: '`loginname` is required', arg: 'loginname' })
      }

      if (!args.password || args.password === '') {
        errors.push({ message: '`password` is required', arg: 'password' })
      }

      if (errors.length > 0) {
        throw new UserInputError(
          errors.map(e => e.message).join(),
          { invalidArgs: errors.map(e => e.arg) })
      }

      const token = await authService.login(args.loginname, args.password)

      if (token === null) {
        throw new UserInputError('Bad loginname or password', { invalidArgs: ['loginname', 'password'] })
      }

      return token
    },

    addRecipe: async (root, args) => {
      if (!args.name || args.name === '') {
        throw new UserInputError('`name` is required', { invalidArgs: 'name' })
      }
    },
    removeRecipe: async (root, args) => {
      if (!args.id) {
        throw new UserInputError('`id` is required', { invalidArgs: 'id' })
      }
    }
  }
}

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
