import mongoose from 'mongoose'
import { IngredientDbObject } from '../generated/graphql'
import uniqueValidator from 'mongoose-unique-validator'
import { DdObjectDocument } from '../util/codegen'

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 64,
    unique: true
  },
  defaultUnit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unit',
    required: true,
  }
})
schema.plugin(uniqueValidator)

export interface IIngredient extends DdObjectDocument, IngredientDbObject {}

export default mongoose.model<IIngredient>('Ingredient', schema)
