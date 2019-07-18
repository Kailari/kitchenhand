import mongoose from 'mongoose'

import Recipe, { IRecipe, RecipeIngredient, IRecipeIngredient } from '../models/Recipe'
import { IUser } from '../models/User'
import ingredientService from './ingredientService'
import unitService from './unitService'
import { ShallowRecipeIngredient } from '../generated/graphql'
import { withAuthAsync as withAuth } from './authService'

const count = async (): Promise<number> => {
  return await Recipe.collection.countDocuments()
}

const getAll = async (): Promise<IRecipe[]> => {
  return await Recipe.find({}).populate('owner')
}

const find = async (id: mongoose.Types.ObjectId | string): Promise<IRecipe | null> => {
  return await Recipe.findById(id)
}

const findAllByUser = async (ownerId: mongoose.Types.ObjectId | string): Promise<IRecipe[] | null> => {
  return await Recipe.find({
    owner: {
      _id: ownerId
    }
  }).populate('owner')
}

const add = async (name: string, description: string, ingredients: ShallowRecipeIngredient[], user: IUser): Promise<IRecipe> => {
  const recipe = new Recipe({
    name: name,
    description: description,
    owner: user.id,
    ingredients: ingredients
  })

  const addedRecipe = await recipe.save() as IRecipe
  user.recipes.push(addedRecipe.id)
  await user.save()

  addedRecipe.owner = user
  return addedRecipe
}

const remove = async (id: mongoose.Types.ObjectId | string): Promise<IRecipe | null> => {
  const recipe = await Recipe.findByIdAndDelete(id).populate('owner')
  if (recipe === null) {
    return null
  }

  const owner = recipe.owner
  const remainingRecipes = owner.recipes.filter((r: IRecipe): boolean => r._id !== recipe._id)
  owner.recipes = remainingRecipes
  await owner.save()

  //await RecipeIngredient.deleteMany({ _id: { $in: recipe.ingredients.map((ingredient): string => ingredient._id) } })
  return recipe
}

const addIngredient = async (recipeId: string): Promise<IRecipeIngredient | null> => {
  const recipe = await Recipe.findById(recipeId)
  if (recipe === null) {
    return null
  }

  const defaultIngredient = await ingredientService.getDefault()
  const defaultUnit = await unitService.getDefault()
  const newIngredient = new RecipeIngredient({
    amount: 1.0,
    ingredient: defaultIngredient,
    unit: defaultUnit
  })
  recipe.ingredients.push(newIngredient)
  await recipe.save()

  return newIngredient
}

const removeIngredient = async (recipeId: string, id: string): Promise<string | null> => {
  const parent = await Recipe.findById(recipeId)
  if (!parent) {
    return null
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ingredient = (parent.ingredients as any).id(id)
    if (!ingredient) {
      return null
    }
    parent.ingredients = parent.ingredients.filter((i): boolean => i.id !== ingredient.id)
    await parent.save()

    return ingredient.id
  } catch (error) {
    console.log('error removing recipe ingredient: ', error)
  }
  return null
}

export default {
  count: withAuth(count),
  getAll: withAuth(getAll),
  find: withAuth(find),
  findAllByUser: withAuth(findAllByUser),
  add: withAuth(add),
  addIngredient: withAuth(addIngredient),
  remove: withAuth(remove),
  removeIngredient: withAuth(removeIngredient),
}
