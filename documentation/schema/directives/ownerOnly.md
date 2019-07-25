ownerOnly
=========
Directive for making a resolver targeting some resource callable only by the user who owns it. By default, users with `SUPERUSER` role can bypass this requirement, although for fields for which this could introduce privacy concerns, this can be configured via `canSuperuserAccess`-parameter.

As this requires getting the resource in question from the database for validating ownership, certain type of service implementation and additional requirements for resolver format are required for this decorator to work. To be more exact:
 - Resolver must have an `resourceID`-argument, which is the ID of the resource resolver is trying to access. For example, for `removeRecipe(id: ID!): Recipe`, this is the argument `id`
 - The type of the resource must be known and specified in the schema via the `resourceType`-argument. This directive relies on this string to find the service, so without it the directive cannot function.
 - Resource must be handled internally via a `ResourceService` registered with `ResourceManager.asService(...)`, otherwise the directive cannot get the resource from the DB for ownership validation and operation fails.

### Parameters

| Parameter             | Type      | Default value |
|-----------------------|-----------|---------------|
| resourceType          | String!   | required      |
| idArg                 | String!   | `resourceId`  |
| canSuperUserAccess    | Boolean!  | `true`        |

 - `resourceType` - Name of the service handling the referenced resource.
 - `idArg` - Name of the resolver argument which holds the ID of the resource we are trying to access.
 - `canSuperUserAccess` - override-flag for preventing superuser access when privacy is a concern

### Example
```gql
type Mutation {
  removeRecipe(
    recipeId: ID!
  ): Recipe @ownerOnly(resourceType: "recipe", idArg: "recipeId")
}
```
