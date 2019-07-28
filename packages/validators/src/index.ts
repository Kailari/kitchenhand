import { ValidationError, ValidationErrorEntry } from './error'
import { ValidatorFunc } from './validator'

import isValidId from './validators/id'
import string from './validators/string'

export const validator = {
  isValidId,
  string,
}

/**
 * Performs validation on given args-object
 *
 * @param args object to validate
 * @param validators collection of validators to apply
 * @throws {ValidationError} Will throw if any of the validators fail.
 */
export const doValidation = (args: any, validators: (ValidatorFunc | ValidatorFunc[])[]): void => {
  let errors: ValidationErrorEntry[] = []
  const onError = (field: string, error: string): void => {
    errors.push({ path: field, error })
  }

  for (const validatorOrArray of validators) {
    if (Array.isArray(validatorOrArray)) {
      (validatorOrArray as ValidatorFunc[])
        .forEach((validator): void => validator(args, onError))
    } else {
      (validatorOrArray as ValidatorFunc)(args, onError)
    }
  }

  if (errors.length > 0) {
    throw new ValidationError(errors)
  }
}
