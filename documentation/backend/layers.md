Backend layers
==============
Backed design is layered as follows:

 1. At the core, the server runs as a HTTP-server through `express`, serving the app as a JavaScript SPA
 2. GraphQL is processed via `apollo-server`/`apollo-server-express` by listening to `/graphql`-endpoint
 3. User actions are received as *GraphQL queries*, which are defined in [schema](./schema/schema.md)
    - Schema defines the shape of the data that is moved between frontend and the backend.
    - Some additional dark arts are involved where directives are involved.
 4. Queries are resolved using *GraphQL Resolvers*
    - Resolvers perform Authorization either directly or indirectly using wrappers injected with directives.
    - As long as directives are added correctly, no external query can access resolver they are not authorized to.
    - Resolvers validate the input arguments before any processing.
    - **This does not remove the need to check user permissions in services if doing more complex data-querying behind-the-scenes.**
 5. Resolvers do not perform any actual processing past validation themselves, but rather propagate the validated requests down to *services*.
 6. Services perform the processing, and when needed, access the *MongoDB*-database through `mongoose`
    - Services have a layer of abstraction to them, hence services which simply handle processes regarding some specific type of data are called *"Resources"*
