import { ValidatorFunc, createParameterizedValidator } from '../validator'

export interface NumberValidationParameters {
  /** Minimum allowed value of the number. Defaults to no limit. */
  minValue?: number,
  /** Maximum allowed value of the number. Defaults to no limit. */
  maxValue?: number,
}

/**
 * Validates that a number meets criteria specified in input NumberValidationParameters
 */
export default createParameterizedValidator<NumberValidationParameters>(
  (field, params): ValidatorFunc => {
    if (params.minValue !== undefined && params.maxValue !== undefined && params.minValue > params.maxValue) {
      throw new Error('Invalid validation parameters: maxValue cannot be smaller than minValue!')
    }

    return (args, error): void => {
      const num = args[field]
      if (num === undefined || num === null) {
        return
      }

      const target = num as number
      if (params.minValue !== undefined && target < params.minValue) {
        error(field, `error.validation.${field}.too_small:${params.minValue}`)
      }

      if (params.maxValue !== undefined && target > params.maxValue) {
        error(field, `error.validation.${field}.too_big:${params.maxValue}`)
      }
    }
  })
