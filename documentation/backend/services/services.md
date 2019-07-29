Services
========

Overview
-----------------
Backend functionality, even though exposed through GraphQL query resolvers, relies internally on *services* each of which expose functionality related to some specific feature of the app. *Services* are the raw bussiness logic of the backend, working on already validated arguments with authorization already handled by other layers.

When working with services, the following statements should always hold true:
 - **All input arguments should be validated before passing them into a service.** Failure to do so is an programming error with major chance of exposing vulnerabilities and/or causing bugs/undefined behavior.
 - Unless there is heavy negative impact to performance/security, **all services should be implemented through the *"Resource"*-abstraction layer**, whenever possible. This allows performing some dark magicks with GraphQL-directives and all around reduces amount of code to be maintained.
 - **Authorization is done *once* when query is resolved**, if the service in question performs further queries to populate the response, **care should be taken that the additional queried data is either covered by directives in resolver definition or explicitely checked for authorization**. Whenever possible, authorization directives should be preferred over explicit checks.

Provided services
-----------------
The backend currently provides the following services.

| Service                                   | Description                   |
|-------------------------------------------|-------------------------------|
| [`authService`](./auth.md)                | Login/register                |
| [`recipeService`](./recipe.md)            | Manage recipes                |
| [`unitService`](./unit.md)                | Manage measurement units      |
| [`ingredientService`](./ingredient.md)    | Manage available ingredients  |
