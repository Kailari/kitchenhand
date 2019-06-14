const { gql } = require('apollo-server')

const {
  types: authTypes,
  queries: authQueries,
  mutations: authMutations
} = require('./auth')

const {
  types: recipeTypes,
  queries: recipeQueries,
  mutations: recipeMutations
} = require('./recipe')

const typeDefs = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`

module.exports = {
  typeDefs: [
    typeDefs,
    authTypes,
    recipeTypes
  ],
  resolvers: {
    Query: {
      ...authQueries,
      ...recipeQueries
    },
    Mutation: {
      ...authMutations,
      ...recipeMutations
    }
  }
}