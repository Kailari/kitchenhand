import { ValidatorFunc, createParameterizedValidator } from '../validator'

export interface StringValidationParameters {
  /** Minimum allowed length of the string. Defaults to no limit. */
  minLength?: number,
  /** Maximum allowed length of the string. Defaults to no limit. */
  maxLength?: number,
  /**
   * Whether or not empty strings are allowed. Validation is not performed if
   * minLength is set.
   *
   * Defaults to true.
   */
  allowEmpty?: boolean,
  /**
   * Regex which input string needs to match in order to be considered valid.
   * Note that min/max length requirements still need to be met.
   *
   * Defaults to all strings pass.
   */
  regex?: string | RegExp,
}

/**
 * Validates that a string meets criteria specified in input StringValidationParameters
 */
export default createParameterizedValidator<StringValidationParameters>(
  (field, params): ValidatorFunc =>
    (args, error): void => {
      if (params.minLength !== undefined && params.maxLength !== undefined && params.minLength > params.maxLength) {
        throw new Error('Invalid validation parameters: maxLength cannot be smaller than minLength!')
      }

      const str = args[field]
      if (!str) {
        return
      }

      const target = str as string
      if (params.minLength !== undefined) {
        if (target.length < params.minLength) {
          error(field, `error.validation.${field}.too_short:${params.minLength}`)
        }
      } else {
        if (params.allowEmpty !== undefined && !params.allowEmpty && target.trim().length === 0) {
          error(field, `error.validation.${field}.cannot_be_empty`)
        }
      }

      if (params.maxLength !== undefined && target.length > params.maxLength) {
        error(field, `error.validation.${field}.too_long:${params.maxLength}`)
      }

      if (params.regex !== undefined && !target.match(params.regex)) {
        error(field, `error.validation.${field}.no_match:${params.regex}`)
      }
    })
