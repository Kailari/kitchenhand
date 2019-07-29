# withAuth
Require user to have specified role for resolver to pass. If context does not contain a valid logged in user or currently logged in user does not have the required role, decorated resolver throws `AuthenticationError`. If all checks pass, resolver works just as it would without the directive.

For more "lightweight" version without role-requirements, see [`requireLogin`](./requireLogin.md)

### Parameters
| Parameter | Type      | Default value |
|-----------|-----------|---------------|
| role      | UserRole! | required      |

### Example
```gql
type Query {
    allUsers: [User!]! @withAuth(role: ADMIN)
}
```