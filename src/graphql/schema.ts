import { gql, makeExecutableSchema } from 'apollo-server'
import { IResolvers } from 'graphql-tools'
import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb'
import { GraphQLSchema } from 'graphql'

import {
  types as authTypes,
  queries as authQueries,
  mutations as authMutations
} from './auth'

import {
  types as recipeTypes,
  //queries as recipeQueries,
  //mutations as recipeMutations
} from './recipe'
import { Resolvers } from '../generated/graphql';

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
    ...authQueries
    //...recipeQueries
  },
  Mutation: {
    ...authMutations,
    //...recipeMutations
  }
}

const schema = makeExecutableSchema({
  allowUndefinedInResolve: true,
  typeDefs,
  resolvers: resolvers as IResolvers
}) as GraphQLSchema

export default schema
