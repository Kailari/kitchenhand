import { ApolloError } from 'apollo-server'

/* eslint-disable @typescript-eslint/explicit-function-return-type */

const matchers: jest.ExpectExtendMap = {
  toContainApolloError(received, code: string, message?: string) {
    const errors = received as ApolloError[]

    if (errors.length === 0) {
      return {
        message: () => 'expected at least one error, received an empty array',
        pass: false
      }
    }

    for (let i = 0; i < errors.length; i++) {
      const error = errors[i]
      const isError = !!error.message && !!error.extensions && !!error.extensions.code
      if (!isError) {
        return {
          message: () => `expected an apollo error, received object: ${error}`,
          pass: false
        }
      }

      const codeMatches = this.equals(error.extensions.code, code)
      if (!codeMatches) {
        return {
          message: () => `expected error-code ${this.utils.stringify(code)}, got ${this.utils.stringify(error.extensions.code)}`,
          pass: false
        }
      }

      if (message) {
        const messageMatches = this.equals(error.message, message)
        if (!messageMatches) {
          return {
            message: () => `expected message ${this.utils.stringify(message)}, got ${this.utils.stringify(error.message)}`,
            pass: false
          }
        }
      }
    }

    return {
      message: () => `expected errors to contain an error with code matching ${this.utils.stringify(code)}${message ? ` and message matching ${this.utils.stringify(message)}.` : '.'}`,
      pass: true
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const jestExpect = (global as any).expect
if (jestExpect !== undefined) {
  jestExpect.extend(matchers)
} else {
  console.error('Unable to find jest global expect!')
}
