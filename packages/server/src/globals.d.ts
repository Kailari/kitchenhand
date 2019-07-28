import 'jest-extended'
import './test/matchers'

declare global {
  namespace jest {
    interface Matchers<R> {
      toContainApolloError(code: string, message?: string): R,
    }
  }
}
