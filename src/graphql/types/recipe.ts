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
    amount: Float! @column
    ingredient: Ingredient! @link
    unit: Unit! @link
  }

  type Recipe @entity {
    id: ID! @id
    name: String! @column
    owner: User! @link
    description: String @column
    ingredients: [RecipeIngredient!]! @link
  }

  input ShallowRecipeIngredient {
    amount: Float!
    ingredient: ID!
    unit: ID!
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
      ingredients: [ShallowRecipeIngredient!]
    ): Recipe!
    removeRecipe(
      id: ID!
    ): Recipe

    addRecipeIngredient(
      recipeId: ID!
    ): RecipeIngredient
    updateRecipeIngredient(
      id: ID!
      recipeId: ID!
      ingredientId: ID
      unitId: ID
      amount: Float
    ): RecipeIngredient
    removeRecipeIngredient(
      recipeId: ID!
      id: ID!
    ): ID
  }
`

export default types
