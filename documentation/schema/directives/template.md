directiveName
=============
Description of the purpose and use cases for this directive.

### Parameters
This directive takes no parameters

*or*

| Parameter | Type      | Default value |
|-----------|-----------|---------------|
| arg1      | Int!      | required      |
| arg2      | String!   | `a string`    |

### Example
```gql
type Query {
    someResolver: Type @directiveName(arg1: 1337)
}
```