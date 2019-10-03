import { ValidatorFunc } from '../validator'

/**
 * Validates that at least one of the given fields is defined.
 */
export default (fields: string[]): ValidatorFunc =>
  (args, error): void => {
    if (fields.every((field): boolean => args[field] === undefined || args[field] === null)) {
      error('required', `error.validation.one_required:${fields.join(',')}`)
    }
  }
