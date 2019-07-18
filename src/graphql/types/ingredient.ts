import { gql } from 'apollo-server'

const types = gql`
  type Ingredient @entity {
    id: ID! @id
    name: String! @column
    defaultUnit: Unit @link
  }
`

export default types
