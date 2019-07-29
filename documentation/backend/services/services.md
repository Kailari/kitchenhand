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

Conventions
-----------
### Naming services
 - All services should be defined in `server/src/services/`, in a file named `<resource-name>Service.ts`
 - For example, service handling `recipe`-resources is defined in `recipeService.ts`
 - Even though services are exported as defaults, it should be preferred importing them with their assigned names. *E.g. importing `import recipeService from 'services/recipeService'` is OK, while `import recipe from 'services/recipeService'` is not*.

### Service functions
 - Exposed service functions should be verbs, describing what the function does. *E.g. if the function fetches a resource from database, it may be named `get`*.
 - Do not postfix the function names with the resource name in question. If properly imported, service name already implies the type of the resource, thus making appending the resource name needless repetition. *E.g. `recipeService.get` is a OK name, while `recipeService.getRecipe` is not*.
 - If targeted resource has sub-resources, it is appropriate to expose a few helper functions for handling those. *However, if there starts to be many helper-methods, consider creating another service and possibly exposing it as a member of the parent-resource's service.*
