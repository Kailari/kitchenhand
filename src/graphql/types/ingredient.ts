import { gql } from 'apollo-server'

const types = gql`
  type Ingredient @entity {
    id: ID! @id
    name: String! @column
    defaultUnit: Unit @link
  }

  extend type Query {
    getIngredient(id: ID!): Ingredient
    findIngredient(filter: String!): [Ingredient!]!
  }

  extend type Mutation {
    addIngredient(name: String!, defaultUnitId: ID!): Ingredient
    removeIngredient(id: ID!): Ingredient
  }
`

export default types
