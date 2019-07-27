import { gql } from 'apollo-server'

const types = gql`
  type Unit @entity {
    id: ID! @id
    name: String! @column
    abbreviation: String! @column
  }

  extend type Query {
    getUnit(id: ID!): Ingredient
    findUnit(filter: String!): [Ingredient!]!
  }

  extend type Mutation {
    addUnit(name: String!, abbreviation: String!): Ingredient
    removeUnit(id: ID!): Ingredient
  }
`

export default types
