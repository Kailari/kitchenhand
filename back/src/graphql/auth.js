const {  UserInputError, gql } = require('apollo-server')
const authService = require('../services/authService')


const types = gql`
  type User {
    id: ID!
    name: String!
  }

  type Token {
    value: String!
  }

  extend type Query {
    userCount: Int!
    allUsers: [User!]!
    findUser(id: ID!): User
    me: User
  }

  extend type Mutation {
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

const queries = {
  userCount: () => authService.userCount(),
  allUsers: () => authService.getAll(),
  findUser: (root, args) => {
    if (!args.id) {
      throw new UserInputError('`id` is required', { invalidArgs: 'id' })
    }

    authService.find(args.id)
  },
  me: (root, args, context) => context.currentUser
}

const mutations = {
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
}

module.exports = { types, queries, mutations }