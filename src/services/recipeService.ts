import mongoose from 'mongoose'

import Recipe, { IRecipe } from '../models/Recipe'
import { IUser } from '../models/User'

const count = async (): Promise<number> => {
  return await Recipe.collection.countDocuments()
}

const getAll = async (): Promise<IRecipe[]> => {
  return await Recipe.find({}).populate('owner')
}

const find = async (id: mongoose.Types.ObjectId | string): Promise<IRecipe | null> => {
  return Recipe.findById(id)
}

const findAllByUser = async (ownerId: mongoose.Types.ObjectId | string): Promise<IRecipe[] | null> => {
  return Recipe.find({
    owner: {
      _id: ownerId
    }
  }).populate('owner')
}

const add = async (name: string, description: string, user: IUser): Promise<IRecipe> => {
  const recipe = new Recipe({
    name: name,
    description: description,
    owner: user.id,
    ingredients: []
  })

  const addedRecipe = await recipe.save() as IRecipe
  // FIXME: add recipes to user
  //user.recipes.concat(addedRecipe.id)
  await user.save()

  addedRecipe.owner = user
  return addedRecipe
}

const remove = async (id: mongoose.Types.ObjectId | string): Promise<IRecipe | null> => {
  return Recipe.findByIdAndDelete(id)
}

export default {
  count,
  getAll,
  find,
  findAllByUser,
  add,
  remove
}