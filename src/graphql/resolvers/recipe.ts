import { UserInputError, ApolloError } from 'apollo-server'

import recipeService from '../../services/recipeService'
import { QueryResolvers, MutationResolvers } from '../../generated/graphql'
import { IRecipe, IRecipeIngredient } from '../../models/Recipe'
import { IUser } from '../../models/User'

export const queries: QueryResolvers = {
  recipeCount: async (): Promise<number> => recipeService.count(),
  allRecipes: async (): Promise<IRecipe[]> => recipeService.getAll(),
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
    return context.currentUser
      ? await recipeService.findAllByUser(context.currentUser._id)
      : null
  }
}

export const mutations: MutationResolvers = {
  addRecipe: async (root, args, context): Promise<IRecipe> => {
    const ingredients = args.ingredients || []

    let newRecipe = null
    try {
      newRecipe = await recipeService.add(args.name, args.description, ingredients, context.currentUser as IUser)
    } catch (error) {
      throw new UserInputError(error.message, {
        invalidArgs: Object.keys(error.errors)
      })
    }

    return newRecipe
  },
  removeRecipe: async (root, args): Promise<IRecipe> => {
    if (!args.id) {
      throw new UserInputError('`id` is required', { invalidArgs: 'id' })
    }

    const recipe = await recipeService.remove(args.id)
    if (!recipe) {
      throw new ApolloError('unknown `id`', 'BAD_ID')
    }

    return recipe
  },
  addRecipeIngredient: async (root, args, context): Promise<IRecipeIngredient | null> => {
    if (!args.recipeId) {
      throw new UserInputError('`recipeId` is required', { invalidArgs: 'recipeId' })
    }

    let newIngredient = null
    newIngredient = await recipeService.addIngredient(args.recipeId)
    if (!newIngredient) {
      throw new ApolloError('unknown `recipeId`', 'BAD_ID')
    }

    return newIngredient
  },
  removeRecipeIngredient: async (root, args, context): Promise<string | null> => {
    if (!args.id) {
      throw new UserInputError('`id` is required', { invalidArgs: 'id' })
    }

    if (!args.recipeId) {
      throw new UserInputError('`recipeId` is required', { invalidArgs: 'recipeId' })
    }

    let removed = null
    removed = await recipeService.removeIngredient(args.recipeId, args.id)
    if (!removed) {
      throw new ApolloError('unknown `id` or `recipeId`', 'BAD_ID')
    }

    console.log('removed: ', removed)
    return removed
  }
}
