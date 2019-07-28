import { gql } from 'apollo-server'

const types = gql`
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
`

export default types
