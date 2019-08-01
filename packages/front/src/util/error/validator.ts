import { ApolloError } from 'apollo-client'

export interface ErrorState {
  [path: string]: string,
}

export const handleValidated = async (run: () => void | Promise<void>, onError: (errors: ErrorState) => void): Promise<void> => {
  try {
    await run()
  } catch (err) {
    if (err.graphQLErrors !== undefined) {
      const parentError = err as ApolloError
      const notHandled = []
      for (const error of parentError.graphQLErrors) {
        if (error.extensions && error.extensions.state && error.extensions.code === 'ARGUMENT_VALIDATION_FAILED') {
          const state = error.extensions.state
          onError(state)
        } else {
          notHandled.push(error)
        }
      }

      if (notHandled.length > 0) {
        parentError.graphQLErrors = notHandled
        throw parentError
      }
    } else {
      throw err
    }
  }
}
