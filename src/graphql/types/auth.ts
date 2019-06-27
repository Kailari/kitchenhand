import { gql } from 'apollo-server'

const types = gql`
  type User @entity(
    additionalFields: [
      { path: "password", type: "string" },
      { path: "loginname", type: "string" },
    ]
  ) {
    id: ID! @id
    name: String! @column
  }

  type Token {
    value: String!
  }

  extend type Query {
    userCount: Int!
    allUsers: [User!]!
    findUser(id: ID!): User
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
`

export default types