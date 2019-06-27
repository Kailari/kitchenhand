import { gql } from 'apollo-server'

const types = gql`
  type Ingredient @entity {
    _id: ID! @id
    name: String! @column
  }

  type Unit @entity {
    _id: ID! @id
    name: String! @column
    abbreviation: String! @column
  }

  type RecipeIngredient @entity {
    _id: ID! @id
    ingredient: Ingredient! @embedded
    amount: Float! @column
    unit: Unit! @embedded
  }

  type Recipe @entity {
    _id: ID! @id
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
    ): Recipe
    removeRecipe(
      id: ID!
    ): Recipe
  }
`

export default types
