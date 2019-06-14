const { gql, UserInputError, AuthenticationError, ApolloError } = require('apollo-server')
const recipeService = require('../services/recipeService')

const types = gql`
  type Ingredient {
    id: ID!
    name: String!
  }

  type Unit {
    id: ID!
    name: String!
    abbreviation: String!
  }

  type RecipeIngredient {
    id: ID!
    ingredient: Ingredient!
    amount: Float!
    unit: Unit!
  }

  type Recipe {
    id: ID!
    name: String!
    owner: User!
    description: String
    ingredients: [RecipeIngredient!]!
  }

  extend type Query {
    recipeCount: Int!
    allRecipes: [Recipe!]!
    recipe(id: ID!): Recipe
    myRecipes: [Recipe!]!
    userRecipes(id: ID!): [Recipe!]!
  }

  extend type Mutation {
    addRecipe(
      name: String!
    ): Recipe
    removeRecipe(
      id: ID!
    ): Recipe
  }
`

const queries = {
  recipeCount: () => recipeService.count(),
  allRecipes: () => recipeService.getAll(),
  recipe: async (root, args) => {
    if (!args.id) {
      throw new UserInputError('`id` is required', { invalidArgs: 'id' })
    }

    return await recipeService.find(args.id)
  },
  userRecipes: async (root, args) => {
    if (!args.id) {
      throw new UserInputError('`id` is required', { invalidArgs: 'id' })
    }

    return await recipeService.findAllByUser(args.id)
  },
  myRecipes: async (root, args, context) => {
    const user = context.currentUser
    return await recipeService.findAllByUser(user.id)
  }
}

const mutations = {
  addRecipe: async (root, args, { currentUser }) => {
    if (!currentUser) {
      throw new AuthenticationError('Not authenticated')
    }

    let newRecipe = null
    try {
      newRecipe = await recipeService.add(args.name, currentUser)
    } catch (error) {
      throw new UserInputError(error.message, {
        invalidArgs: Object.keys(error.errors)
      })
    }

    return newRecipe
  },
  removeRecipe: async (root, args, { currentUser }) => {
    if (!currentUser) {
      throw new AuthenticationError('Not authenticated')
    }

    if (!args.id) {
      throw new UserInputError('`id` is required', { invalidArgs: 'id' })
    }

    const recipe = await recipeService.remove(args.id)
    if (!recipe) {
      throw new ApolloError('unknown `id`', 'BAD_ID')
    }

    return recipe
  }
}

module.exports = { types, queries, mutations }