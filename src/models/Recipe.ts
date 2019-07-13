import mongoose from 'mongoose'
import { RecipeDbObject, RecipeIngredientDbObject } from '../generated/graphql'
import { DdObjectDocument } from '../util/codegen'

const recipeIngredientSchema = new mongoose.Schema({
  ingredient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ingredient',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  unit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unit',
    required: true
  },
})

export interface IRecipeIngredient extends DdObjectDocument, RecipeIngredientDbObject {}

export const RecipeIngredient = mongoose.model<IRecipeIngredient>('RecipeIngredient', recipeIngredientSchema)

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 64
  },
  description: {
    type: String,
    maxlength: 2048
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ingredients: [
    {
      ingredient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ingredient',
        required: true
      },
      amount: {
        type: Number,
        required: true
      },
      unit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Unit',
        required: true
      },
    }
  ]
})

export interface IRecipe extends DdObjectDocument, RecipeDbObject { }

export default mongoose.model<IRecipe>('Recipe', schema)
