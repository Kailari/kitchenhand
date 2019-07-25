import { makeExecutableSchema } from 'apollo-server'
import { IResolvers } from 'graphql-tools'
import { GraphQLSchema } from 'graphql'

import { typeDefs } from './schema.types'

import {
  queries as authQueries,
  mutations as authMutations
} from './resolvers/auth'

import {
  queries as recipeQueries,
  mutations as recipeMutations
} from './resolvers/recipe'

import {
  queries as unitQueries,
  mutations as unitMutations
} from './resolvers/unit'

import {
  queries as ingredientQueries,
  mutations as ingredientMutations
} from './resolvers/ingredient'

import { Resolvers } from '../generated/graphql'
import authDirectives from './directives/auth.classes'

const schemaDirectives = {
  ...authDirectives,
}

const resolvers: Resolvers = {
  Query: {
    ...authQueries,
    ...recipeQueries,
    ...unitQueries,
    ...ingredientQueries,
  },
  Mutation: {
    ...authMutations,
    ...recipeMutations,
    ...unitMutations,
    ...ingredientMutations,
  }
}

const schema = makeExecutableSchema({
  allowUndefinedInResolve: true,
  typeDefs: typeDefs,
  resolvers: resolvers as IResolvers,
  schemaDirectives: schemaDirectives
}) as GraphQLSchema

export default schema
