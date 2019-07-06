import { gql } from 'apollo-server'

const types = gql`
  type Unit @entity {
    id: ID! @id
    name: String! @column
    abbreviation: String! @column
  }

  type Ingredient @entity {
    id: ID! @id
    name: String! @column
    defaultUnit: Unit @link
  }

  type RecipeIngredient @entity {
    id: ID! @id
    ingredient: Ingredient! @embedded
    amount: Float! @column
    unit: Unit! @embedded
  }

  type Recipe @entity {
    id: ID! @id
    name: String! @column
    owner: User! @link
    description: String @column
    ingredients: [RecipeIngredient!]! @link
  }

  extend type Query {
    recipeCount: Int!
    allRecipes: [Recipe!]!
    recipe(id: ID!): Recipe
    myRecipes: [Recipe!]
    userRecipes(id: ID!): [Recipe!]
  }

  extend type Mutation {
    addRecipe(
      name: String!
      description: String!
    ): Recipe!
    removeRecipe(
      id: ID!
    ): Recipe

    addRecipeIngredient(
      recipeId: ID!
      ingredientId: ID!
      amount: Float!
    ): RecipeIngredient!
  }
`

export default types
