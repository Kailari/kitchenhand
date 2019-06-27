import { UserInputError, AuthenticationError, ApolloError } from 'apollo-server'

import recipeService from '../../services/recipeService';
import { QueryResolvers, MutationResolvers } from '../../generated/graphql'

export const queries: QueryResolvers = {
  recipeCount: (root, args, context) => recipeService.count(),
  allRecipes: (root, args, context) => recipeService.getAll(),
  recipe: async (root, args, context) => {
    if (!args.id) {
      throw new UserInputError('`id` is required', { invalidArgs: 'id' })
    }

    return await recipeService.find(args.id)
  },
  userRecipes: async (root, args) => {
    if (!args.id) {
      throw new UserInputError('`id` is required', { invalidArgs: 'id' })
    }

    return await recipeService.findAllByUser(args.id)
  },
  myRecipes: async (root, args, context) => {
    const user = context.currentUser
    return !user
      ? null
      : await recipeService.findAllByUser(user._id)
  }
}

export const mutations: MutationResolvers = {
  addRecipe: async (root, args, { currentUser }) => {
    if (!currentUser) {
      throw new AuthenticationError('Not authenticated')
    }

    let newRecipe = null
    try {
      newRecipe = await recipeService.add(args.name, args.description, currentUser)
    } catch (error) {
      throw new UserInputError(error.message, {
        invalidArgs: Object.keys(error.errors)
      })
    }

    return newRecipe
  },
  removeRecipe: async (root, args, { currentUser }) => {
    if (!currentUser) {
      throw new AuthenticationError('Not authenticated')
    }

    if (!args.id) {
      throw new UserInputError('`id` is required', { invalidArgs: 'id' })
    }

    const recipe = await recipeService.remove(args.id)
    if (!recipe) {
      throw new ApolloError('unknown `id`', 'BAD_ID')
    }

    return recipe
  }
}
