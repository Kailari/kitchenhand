import { gql, UserInputError, AuthenticationError, ApolloError } from 'apollo-server'
import recipeService from '../services/recipeService';

export const types = gql`
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
    myRecipes: [Recipe!]!
    userRecipes(id: ID!): [Recipe!]!
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
/*
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
      newRecipe = await recipeService.add(args.name, args.description, currentUser)
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
*/
