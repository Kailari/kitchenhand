// Yo dawg, heard you like schema, so we put some schema in your schema!
// Schema used file for generating the type definitions required by the actual schema
import { gql, makeExecutableSchema } from 'apollo-server'
import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb'
import { GraphQLSchema } from 'graphql'

import authTypes from './types/auth'
import unitTypes from './types/unit'
import ingredientTypes from './types/ingredient'
import recipeTypes from './types/recipe'

import authDirectives from './directives/auth'

const typeDefsInternal = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`

export const typeDefs = [
  DIRECTIVES,
  authDirectives,
  typeDefsInternal,
  authTypes,
  unitTypes,
  ingredientTypes,
  recipeTypes
]

export default makeExecutableSchema({
  allowUndefinedInResolve: true,
  typeDefs: typeDefs,
}) as GraphQLSchema
