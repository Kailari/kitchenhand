const { gql, UserInputError } = require('apollo-server')

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
    ingredients: [RecipeIngredient!]!
  }

  extend type Query {
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

}

const mutations = {
  addRecipe: async (root, args) => {
    if (!args.name || args.name === '') {
      throw new UserInputError('`name` is required', { invalidArgs: 'name' })
    }
  },
  removeRecipe: async (root, args) => {
    if (!args.id) {
      throw new UserInputError('`id` is required', { invalidArgs: 'id' })
    }
  }
}

module.exports = { types, queries, mutations }