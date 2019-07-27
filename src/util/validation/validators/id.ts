import { ValidatorFunc } from '../types'
import { createValidator } from '../util'

/**
 * Validates that the given field is a valid ObjectID.
 */
export default createValidator((field): ValidatorFunc =>
  (args, error): void => {
    const id = args[field] as ID
    if (id === undefined || id === null) {
      return
    }

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      error(field, `error.validation.${field}.malformed_id`)
    }
  })
