import { gql } from 'apollo-server'

const types = gql`
  type RecipeIngredient @entity {
    id: ID! @id
    index: Int! @column
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
    recipeCount: Int! @requirePermissions(permissions: [PRIVATE_QUERIES])
    allRecipes: [Recipe!]! @requireLogin
    recipe(id: ID!): Recipe @requireLogin
    myRecipes: [Recipe!] @requireLogin
    userRecipes(id: ID!): [Recipe!] @requireLogin
  }

  extend type Mutation {
    addRecipe(
      name: String!
      description: String!
      ingredients: [ShallowRecipeIngredient!]
    ): Recipe! @requireLogin
    updateRecipe(
      id: ID!
      name: String
      description: String
    ): Recipe @requireLogin @ownerOnly(resourceType: "recipe", idArg: "id")
    removeRecipe(
      id: ID!
    ): Recipe @requireLogin @ownerOnly(resourceType: "recipe", idArg: "id")

    addRecipeIngredient(
      recipeId: ID!
    ): RecipeIngredient @requireLogin @ownerOnly(resourceType: "recipe", idArg: "recipeId")
    updateRecipeIngredient(
      id: ID!
      recipeId: ID!
      ingredientId: ID
      unitId: ID
      amount: Float
      index: Int
    ): RecipeIngredient @requireLogin @ownerOnly(resourceType: "recipe", idArg: "recipeId")
    removeRecipeIngredient(
      recipeId: ID!
      id: ID!
    ): ID @requireLogin @ownerOnly(resourceType: "recipe", idArg: "recipeId")
  }
`

export default types
