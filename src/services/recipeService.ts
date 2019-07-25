import mongoose from 'mongoose'
import Recipe, { IRecipe, RecipeIngredient, IRecipeIngredient } from '../models/Recipe'
import { IUser } from '../models/User'
import ingredientService from './ingredientService'
import unitService from './unitService'
import { ShallowRecipeIngredient } from '../generated/graphql'
import ResourceManager, { MongoCRUDService } from '../resources'

const count = async (): Promise<number> => {
  return await Recipe.collection.countDocuments()
}

const getAll = async (): Promise<IRecipe[]> => {
  return await Recipe.find({}).populate('owner')
}

const getAllByUser = async (userId: string): Promise<IRecipe[] | null> => {
  return await Recipe.find({
    owner: {
      _id: userId
    }
  }).populate('owner')
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

interface RecipeFields {
  name: string,
  description: string,
  ingredients: ShallowRecipeIngredient[],
}

interface RecipeService extends MongoCRUDService<IRecipe, RecipeFields> {
  getAll: () => Promise<IRecipe[]>,
  count: () => Promise<number>,

  getAllByUser: (userId: string) => Promise<IRecipe[] | null>,
  addIngredient: (recipeId: string) => Promise<IRecipeIngredient | null>,
  removeIngredient: (recipeId: string, id: string) => Promise<string | null>,
}

export default ResourceManager.asSimpleMongoCRUDService<RecipeService, IRecipe, RecipeFields>({
  name: 'recipe',
  model: Recipe,
  hasOwner: true,
  onCreate: async (created: IRecipe, fields: RecipeFields, maybeOwner?: IUser): Promise<IRecipe> => {
    const owner = maybeOwner as IUser
    owner.recipes.push(created.id)
    await owner.save()

    created.owner = owner
    return created
  },
  onRemove: async (removed: IRecipe): Promise<IRecipe> => {
    if (!removed.owner) {
      throw new Error('Error removing recipe from owner: owner is undefined!')
    }

    const owner = removed.owner as IUser
    const remainingRecipes = owner.recipes.filter((recipeId): boolean => recipeId !== removed._id)
    owner.recipes = remainingRecipes
    await owner.save()
    return removed
  },
  populateQuery: (query): mongoose.DocumentQuery<IRecipe | null, IRecipe> => query.populate('owner'),

  getAll,
  count,

  getAllByUser,
  addIngredient,
  removeIngredient,
})
