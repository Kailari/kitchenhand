import mongoose from 'mongoose'
import Recipe, { IRecipe, RecipeIngredient, IRecipeIngredient } from '../models/Recipe'
import { IUser } from '../models/User'
import ingredientService from './ingredientService'
import unitService from './unitService'
import { ShallowRecipeIngredient } from '../generated/graphql'
import ResourceManager, { MongoCRUDService } from '../resources'
import Ingredient from '../models/Ingredient'
import Unit from '../models/Unit'

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

const addIngredient = async (recipeId: string, amount: number, ingredientId: ID, unitId?: ID): Promise<IRecipeIngredient | null> => {
  const recipe = await Recipe.findById(recipeId)
  if (!recipe) {
    return null
  }

  const ingredient = await ingredientService.get(ingredientId)
  if (!ingredient) {
    return null
  }

  const unit = unitId
    ? await unitService.get(unitId)
    : await unitService.get(ingredient.defaultUnit)
  if (!unit) {
    return null
  }

  const newIngredient = new RecipeIngredient({
    amount: amount,
    ingredient: ingredient.id,
    unit: unit.id,
  })
  recipe.ingredients.push(newIngredient)
  await recipe.save()

  newIngredient.ingredient = ingredient
  newIngredient.unit = unit
  return newIngredient
}

const removeIngredient = async (recipeId: ID, id: ID): Promise<string | null> => {
  const parent = await Recipe.findById(recipeId)
  if (!parent) {
    return null
  }

  try {
    const ingredient: IRecipeIngredient | null = (parent.ingredients as any).id(id)
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

const updateIngredient = async (id: ID, recipeId: ID, amount?: number, ingredientId?: ID, unitId?: ID): Promise<IRecipeIngredient | null> => {
  const recipe = await Recipe.findById(recipeId)
    .populate({
      path: 'ingredients',
      populate: [
        {
          path: 'ingredient'
        },
        {
          path: 'unit'
        }
      ]
    })

  console.log('recipe:', recipe)
  if (!recipe) {
    return null
  }

  const recipeIngredient: IRecipeIngredient | null = (recipe.ingredients as any).id()
  if (recipeIngredient === null) {
    return null
  }

  if (amount) recipeIngredient.amount = amount
  let ingredient = recipeIngredient.ingredient
  if (ingredientId) {
    ingredient = await Ingredient.findById(ingredientId)
    if (ingredient) recipeIngredient.ingredient = ingredientId
  }
  let unit = recipeIngredient.unit
  if (unitId) {
    unit = await Unit.findById(unitId)
    if (unit) recipeIngredient.unit = unitId
  }
  await recipeIngredient.save()

  recipeIngredient.ingredient = unit
  recipeIngredient.unit = unit
  return recipeIngredient
}

interface RecipeFields {
  name: string,
  description: string,
  ingredients: ShallowRecipeIngredient[],
}

interface RecipeService extends MongoCRUDService<IRecipe, RecipeFields> {
  getAll: () => Promise<IRecipe[]>,
  count: () => Promise<number>,

  getAllByUser: (userId: ID) => Promise<IRecipe[] | null>,
  addIngredient: (recipeId: ID) => Promise<IRecipeIngredient | null>,
  removeIngredient: (recipeId: ID, id: ID) => Promise<string | null>,
  updateIngredient: (id: ID, recipeId: ID, amount?: number, ingredientId?: ID, unitId?: ID) => Promise<IRecipeIngredient | null>,
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

  count,
  getAll,

  getAllByUser,
  addIngredient,
  removeIngredient,
  updateIngredient,
})
