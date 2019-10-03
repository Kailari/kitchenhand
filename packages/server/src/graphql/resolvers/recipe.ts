import { UserInputError, ApolloError } from 'apollo-server'

import recipeService from '../../services/recipeService'
import { QueryResolvers, MutationResolvers } from '../../generated/graphql'
import { IRecipe, IRecipeIngredient } from '../../models/Recipe'
import { IUser } from '../../models/User'
import { doValidation, validator } from 'validators'
import Ingredient, { IIngredient } from '../../models/Ingredient'
import Unit, { IUnit } from '../../models/Unit'

export const queries: QueryResolvers = {
  recipeCount: async (): Promise<number> => recipeService.count(),
  allRecipes: async (): Promise<IRecipe[]> => recipeService.getAll(),
  recipe: async (root, args): Promise<IRecipe | null> => {
    doValidation(args, [
      validator.isValidId('id')
    ])

    return await recipeService.get(args.id)
  },
  userRecipes: async (root, args): Promise<IRecipe[] | null> => {
    doValidation(args, [
      validator.isValidId('id')
    ])

    return await recipeService.getAllByUser(args.id)
  },
  myRecipes: async (root, args, context): Promise<IRecipe[] | null> => {
    return context.currentUser
      ? await recipeService.getAllByUser(context.currentUser.id)
      : null
  }
}

export const mutations: MutationResolvers = {
  addRecipe: async (root, args, context): Promise<IRecipe> => {
    doValidation(args, [
      validator.string('name', { minLength: 3, maxLength: 64 }),
      validator.string('description', { allowEmpty: true, maxLength: 2048 })
    ])
    const ingredients = args.ingredients || []

    let newRecipe = null
    try {
      const fields = {
        name: args.name,
        description: args.description,
        ingredients,
        owner: context.currentUser as IUser
      }
      newRecipe = await recipeService.create(fields)
    } catch (error) {
      throw new UserInputError(error.message, {
        invalidArgs: Object.keys(error.errors)
      })
    }

    if (!newRecipe) {
      throw new ApolloError('Unknown error while creating recipe', 'CREATE_FAILED')
    }

    return newRecipe
  },
  updateRecipe: async (root, args): Promise<IRecipe | null> => {
    doValidation(args, [
      validator.isValidId('id'),
      validator.string('name', { minLength: 3, maxLength: 64 }),
      validator.string('description', { allowEmpty: true, maxLength: 2048 })
    ])

    const updatedFields = Object.keys(args)
      .filter((key): boolean => key !== 'id')
      .filter((key): boolean => (args as any)[key] !== undefined)
      .reduce((result: { [key: string]: any }, current: string): { [key: string]: any } => ({ ...result, [current]: (args as any)[current] }), {})

    return await recipeService.update(args.id, updatedFields)
  },
  removeRecipe: async (root, args): Promise<IRecipe> => {
    doValidation(args, [
      validator.isValidId('id')
    ])

    const recipe = await recipeService.remove(args.id)
    if (!recipe) {
      throw new ApolloError('unknown `id`', 'BAD_ID')
    }

    return recipe
  },
  addRecipeIngredient: async (root, args): Promise<IRecipeIngredient | null> => {
    doValidation(args, [
      validator.isValidId('recipeId')
    ])

    // TODO: Fix these to use the new format where client needs to select ingredients BEFORE creating the ingredient
    const newIngredient = await recipeService.addIngredient(
      args.recipeId,
      1.0,
      ((await Ingredient.findOne({ name: { $not: '__removed' } })) as IIngredient)._id,
      ((await Unit.findOne({ name: { $not: '__removed' } })) as IUnit)._id)
    if (!newIngredient) {
      throw new ApolloError('unknown `recipeId`, `unitId` or `ingredientId`', 'BAD_ID')
    }

    return newIngredient
  },
  removeRecipeIngredient: async (root, args): Promise<string | null> => {
    doValidation(args, [
      validator.isValidId(['id', 'recipeId'])
    ])

    const removed = await recipeService.removeIngredient(args.recipeId, args.id)
    if (!removed) {
      throw new ApolloError('unknown `id` or `recipeId`', 'BAD_ID')
    }

    return removed
  },
  updateRecipeIngredient: async (root, args): Promise<IRecipeIngredient | null> => {
    doValidation(args, [
      validator.isValidId(['id', 'recipeId', 'ingredientId', 'unitId']),
      validator.number('amount', { minValue: 0, maxValue: 100000 }),
      validator.number('index', { minValue: 0, maxValue: 100000 }),
      validator.requireOneOf(['amount', 'ingredientId', 'unitId', 'index']),
    ])

    if (args.index === null) args.index = undefined
    if (args.amount === null) args.amount = undefined
    console.log('args:', args)
    const updated = await recipeService.updateIngredient(args.id, args.recipeId, args.index, args.amount, args.ingredientId || undefined, args.unitId || undefined)
    if (!updated) {
      throw new ApolloError('unknown `id` or `recipeId`', 'BAD_ID')
    }

    return updated
  }
}
