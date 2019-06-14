const Recipe = require('../models/Recipe')

const count = async () => {
  return Recipe.collection.countDocuments()
}

const getAll = async () => {
  return Recipe.find({}).populate('owner')
}

const find = async (id) => {
  return Recipe.findById(id)
}

const add = async (name, user) => {
  const recipe = new Recipe({
    name: name,
    owner: user.id,
  })
  recipe.ingredients = []
  recipe.description = null

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
  add,
  remove
}