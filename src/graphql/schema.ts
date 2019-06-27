import { gql, makeExecutableSchema } from 'apollo-server'
import { IResolvers } from 'graphql-tools'
import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb'
import { GraphQLSchema } from 'graphql'

import authTypes from './types/auth'
import {
  queries as authQueries,
  mutations as authMutations
} from './resolvers/auth'

import recipeTypes from './types/recipe'
import {
  queries as recipeQueries,
  mutations as recipeMutations
} from './resolvers/recipe'

import { Resolvers } from '../generated/graphql'

const typeDefsInternal = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`

const typeDefs = [
  DIRECTIVES,
  typeDefsInternal,
  authTypes,
  recipeTypes
]

const resolvers: Resolvers = {
  Query: {
    ...authQueries,
    ...recipeQueries,
  },
  Mutation: {
    ...authMutations,
    ...recipeMutations,
  }
}

const schema = makeExecutableSchema({
  allowUndefinedInResolve: true,
  typeDefs,
  resolvers: resolvers as IResolvers
}) as GraphQLSchema

export default schema
