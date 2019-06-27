// Yo dawg, heard you like schema, so we but some schema in your schema!
// Schema used file for generating the type definitions required by the actual schema
import { gql, makeExecutableSchema } from 'apollo-server'
import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb'
import { GraphQLSchema } from 'graphql'

import authTypes from './types/auth'
import recipeTypes from './types/recipe'

const typeDefsInternal = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`

export default makeExecutableSchema({
  allowUndefinedInResolve: true,
  typeDefs: [
    DIRECTIVES,
    typeDefsInternal,
    authTypes,
    recipeTypes
  ]
}) as GraphQLSchema
