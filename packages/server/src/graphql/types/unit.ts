import { gql } from 'apollo-server'

const types = gql`
  type Unit @entity {
    id: ID! @id
    name: String! @column
    abbreviation: String! @column
  }

  extend type Query {
    allUnits: [Unit!]!
    unit(id: ID!): Unit
    findUnit(filter: String!): [Unit!]!
  }

  extend type Mutation {
    addUnit(name: String!, abbreviation: String!): Unit
    removeUnit(id: ID!): Unit
  }
`

export default types
