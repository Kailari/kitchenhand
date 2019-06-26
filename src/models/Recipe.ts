import mongoose from 'mongoose';
import { RecipeDbObject } from '../generated/graphql';

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
      type: mongoose.Schema.Types.ObjectId,
      //ref: 'User'
    }
  ]
})

export interface IRecipe extends mongoose.Document, RecipeDbObject {}

export default mongoose.model('Recipe', schema)