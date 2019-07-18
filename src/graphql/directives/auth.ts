import { gql } from 'apollo-server'

export default gql`
  directive @requirePermissions(
    permissions: [UserPermissions]!
    canSuperUserAccess: Boolean = true
  ) on FIELD_DEFINITION

  directive @requireLogin on FIELD_DEFINITION
`
