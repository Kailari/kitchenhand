import { ApolloError } from 'apollo-server'

export interface ValidationErrorEntry {
  path: string,
  error: string,
}

interface ValidationErrorState {
  [key: string]: string[],
}

export class ValidationError extends ApolloError {
  public constructor(errors: ValidationErrorEntry[]) {
    super('The request has invalid arguments', 'ARGUMENT_VALIDATION_FAILED')
    this.extensions.state = errors.reduce<ValidationErrorState>((result, error): ValidationErrorState => {
      if (!result.hasOwnProperty(error.path)) {
        result[error.path] = []
      }
      result[error.path].push(error.error)
      return result
    }, {})
  }
}
