const Recipe = require('../models/Recipe')

const count = async () => {
  return Recipe.collection.countDocuments()
}

const getAll = async () => {
  return Recipe.find({})
}

const find = async (id) => {
  return Recipe.findById(id)
}

const add = async (name) => {
  const recipe = new Recipe({
    name: name
  })

  return recipe.save()
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