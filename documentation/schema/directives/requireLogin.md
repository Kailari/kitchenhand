requireLogin
============
Require user to be logged in for resolver to pass. If context does not contain valid logged in user, decorated resolver throws `AuthenticationError`. Otherwise, resolver works just as it would without the directive.

For more advanced version with ability to set required role, see [`withAuth`](./withAuth.md)

### Parameters
This directive takes no parameters

### Example
```gql
type Query {
    myRecipes: [Recipe!]! @requireLogin
}
```