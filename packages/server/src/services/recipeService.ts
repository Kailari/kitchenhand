import { DocumentQuery } from 'mongoose'
import Recipe, { IRecipe, RecipeIngredient, IRecipeIngredient } from '../models/Recipe'
import User, { IUser } from '../models/User'
import ingredientService from './ingredientService'
import unitService from './unitService'
import { ShallowRecipeIngredient } from '../generated/graphql'
import { MongoCRUDService } from '../resources/mongoResource'
import Ingredient from '../models/Ingredient'
import Unit from '../models/Unit'
import { ServiceWithGetOwnerId } from '../resources/resource'

export interface RecipeFields {
  name: string,
  description: string,
  ingredients: ShallowRecipeIngredient[],
  owner: IUser,
}

export class RecipeService extends MongoCRUDService<IRecipe, RecipeFields> implements ServiceWithGetOwnerId {
  public async create(fields: RecipeFields): Promise<IRecipe | null> {
    const { owner } = fields
    const recipe = await super.create(fields)
    if (!recipe) {
      return null
    }

    await User.updateOne({ _id: owner.id }, { $push: { recipes: recipe.id } })
    return recipe
  }

  public async remove(id: ID): Promise<IRecipe | null> {
    const recipe = await super.remove(id)
    if (!recipe) {
      return null
    }

    if (!recipe.owner) {
      throw new Error('Error removing recipe from owner: owner is undefined!')
    }

    await User.updateOne({ _id: recipe.owner }, { $pull: { recipes: recipe.id } })
    return recipe
  }

  public getQuery(id: ID): DocumentQuery<IRecipe | null, IRecipe> {
    return super.getQuery(id).populate('owner').populate('ingredients.unit').populate('ingredients.ingredient')
  }

  public removeQuery(id: ID): DocumentQuery<IRecipe | null, IRecipe> {
    return super.removeQuery(id).populate('owner')
  }

  public async getOwnerId(id: ID): Promise<ID | null> {
    const result = await Recipe.findById(id).select('owner')
    return result ? result.owner : null
  }

  public async count(): Promise<number> {
    return await Recipe.collection.countDocuments()
  }

  public async getAll(): Promise<IRecipe[]> {
    return await Recipe.find({}).populate('owner')
  }

  public async getAllByUser(userId: string): Promise<IRecipe[] | null> {
    return await Recipe.find({
      owner: {
        _id: userId
      }
    }).populate('owner')
  }

  public async addIngredient(recipeId: string, amount: number, ingredientId: ID, unitId?: ID): Promise<IRecipeIngredient | null> {
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

  public async removeIngredient(recipeId: ID, id: ID): Promise<string | null> {
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

  public async updateIngredient(id: ID, recipeId: ID, amount?: number, ingredientId?: ID, unitId?: ID): Promise<IRecipeIngredient | null> {
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
}

export default new RecipeService('recipe', Recipe)
