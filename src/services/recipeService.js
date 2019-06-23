const Recipe = require('../models/Recipe')
const mongoose = require('mongoose')

const count = async () => {
  return Recipe.collection.countDocuments()
}

const getAll = async () => {
  return Recipe.find({}).populate('owner')
}

const find = async (id) => {
  return Recipe.findById(id)
}

const findAllByUser = async (ownerId) => {
  return Recipe.find({
    owner: {
      _id: ownerId
    }
  }).populate('owner')
}

const add = async (name, description, user) => {
  const recipe = new Recipe({
    name: name,
    description: description,
    owner: user.id,
  })
  recipe.ingredients = []

  const addedRecipe = await recipe.save()
  user.recipes.concat(addedRecipe.id)
  await user.save()

  addedRecipe.owner = user
  return addedRecipe
}

const remove = async (id) => {
  return Recipe.findByIdAndDelete(id)
}

module.exports = {
  count,
  getAll,
  find,
  findAllByUser,
  add,
  remove
}