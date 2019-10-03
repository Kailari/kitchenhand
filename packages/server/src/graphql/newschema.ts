import { gql, makeExecutableSchema } from 'apollo-server'
import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb'
import { GraphQLSchema } from 'graphql'

const typeDefsInternal = gql`
  directive @requirePermissions(
    permissions: [UserPermissions]!
    canSuperUserAccess: Boolean! = true
  ) on FIELD_DEFINITION

  directive @requireLogin on FIELD_DEFINITION

  directive @ownerOnly(
    resourceType: String!
    idArg: String! = "resourceId"
    canSuperUserAccess: Boolean! = true
  ) on FIELD_DEFINITION

  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
  
  enum UserPermissions {
    ADMIN,
    PRIVATE_QUERIES,
    SUPERUSER
  }

  type User @entity(
    additionalFields: [
      { path: "password", type: "string" },
      { path: "loginname", type: "string" },
    ]
  ) {
    id: ID! @id
    name: String! @column
    recipes: [Recipe]! @link
    permissions: [UserPermissions!]! @column
  }

  type Token {
    value: String!
  }

  extend type Query {
    userCount: Int! @requirePermissions(permissions: [PRIVATE_QUERIES])
    allUsers: [User!]! @requirePermissions(permissions: [PRIVATE_QUERIES])
    findUser(id: ID!): User @requireLogin
    me: User
  }

  extend type Mutation {
    registerUser(
      name: String!
      loginname: String!
      password: String!
    ): User
    login(
      loginname: String!
      password: String!
    ): Token
  }

  type Ingredient @entity {
    id: ID! @id
    name: String! @column
    defaultUnit: Unit @link
  }

  extend type Query {
    allIngredients: [Ingredient!]!
    getIngredient(id: ID!): Ingredient
    findIngredient(filter: String!): [Ingredient!]!
  }

  extend type Mutation {
    addIngredient(name: String!, defaultUnitId: ID): Ingredient
    updateIngredient(id: ID!, name: String, defaultUnitId: ID): Ingredient
    removeIngredient(id: ID!): Ingredient
  }

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

  type Unit @entity {
    id: ID! @id
    name: String! @column
    abbreviation: String @column
  }

  extend type Query {
    allUnits: [Unit!]!
    unit(id: ID!): Unit
    findUnit(filter: String!): [Unit!]!
  }

  extend type Mutation {
    addUnit(name: String!, abbreviation: String): Unit
    updateUnit(id: ID!, name: String, abbreviation: String): Unit
    removeUnit(id: ID!): Unit
  }
`

export const typeDefs = [
  DIRECTIVES,
  typeDefsInternal,
]

export default makeExecutableSchema({
  allowUndefinedInResolve: true,
  typeDefs: typeDefs,
}) as GraphQLSchema
