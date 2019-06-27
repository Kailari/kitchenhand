import { UserInputError, AuthenticationError, ApolloError } from 'apollo-server'

import recipeService from '../../services/recipeService'
import { QueryResolvers, MutationResolvers } from '../../generated/graphql'
import { IRecipe } from '../../models/Recipe'

export const queries: QueryResolvers = {
  recipeCount: (): Promise<number> => recipeService.count(),
  allRecipes: (): Promise<IRecipe[]> => recipeService.getAll(),
  recipe: async (root, args): Promise<IRecipe | null> => {
    if (!args.id) {
      throw new UserInputError('`id` is required', { invalidArgs: 'id' })
    }

    return await recipeService.find(args.id)
  },
  userRecipes: async (root, args): Promise<IRecipe[] | null> => {
    if (!args.id) {
      throw new UserInputError('`id` is required', { invalidArgs: 'id' })
    }

    return await recipeService.findAllByUser(args.id)
  },
  myRecipes: async (root, args, context): Promise<IRecipe[] | null> => {
    const user = context.currentUser
    return !user
      ? null
      : await recipeService.findAllByUser(user._id)
  }
}

export const mutations: MutationResolvers = {
  addRecipe: async (root, args, { currentUser }): Promise<IRecipe> => {
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
  removeRecipe: async (root, args, { currentUser }): Promise<IRecipe> => {
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
