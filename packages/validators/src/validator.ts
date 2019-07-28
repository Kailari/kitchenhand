/**
 * Consumer for populating the list of errors during the validation process.
 * Consumes an error and pushes it to the final list of errors.
 *
 * @param field name of the field which failed to validate
 * @param error error message describing why validation failed
 */
export type ErrorConsumer = (field: string, error: string) => void

/**
 * Constructed validator function already bound to some specific field
 *
 * @param args  args-object being validated
 * @param error callback for populating the error list
 */
export type ValidatorFunc = (args: any, error: ErrorConsumer) => void

/**
 * Factory function for creating a simple validator. Accepts name of the field to
 * validate and outputs a validator function.
 */
export type ValidatorFuncFactory = (field: string) => ValidatorFunc

/**
 * Factory function for creating a validator-wrapper, which allows validator
 * functions to transparently switch between taking single field name or an array
 * of names.
 */
export type ValidatorFactory = (fields: string | string[]) => ValidatorFunc | ValidatorFunc[]

/**
 * Creates a simple validator factory which take no additional validator parameters.
 *
 * @param validatorFactory factory which produces the validator(s)
 */
export const createValidator = (
  validatorFactory: ValidatorFuncFactory
): ValidatorFactory =>
  (fields: string | string[]): ValidatorFunc | ValidatorFunc[] => {
    return Array.isArray(fields)
      ? fields.map((field): ValidatorFunc => validatorFactory(field))
      : validatorFactory(fields)
  }


/**
 * Factory function for creating a paramaterized validator. Accepts name of
 * the field to validate, a parameters object and outputs a validator function.
 */
export type ParameterizedValidatorFuncFactory<TParams> = (field: string, params: TParams) => ValidatorFunc

/**
 * Factory function for creating a validator-wrapper, which allows validator
 * functions to transparently switch between taking single field name or an array
 * of names.
 */
export type ParameterizedValidatorFactory<TParams> = (fields: string | string[], params: TParams) => ValidatorFunc | ValidatorFunc[]

/**
 * Creates a parameterized validator factory which accepts validator parameters.
 *
 * @param validatorFactory factory which produces the validator(s)
 */
export const createParameterizedValidator = <TParams>(
  validatorFactory: ParameterizedValidatorFuncFactory<TParams>
): ParameterizedValidatorFactory<TParams> =>
  (fields: string | string[], params: TParams): ValidatorFunc | ValidatorFunc[] => {
    return Array.isArray(fields)
      ? fields.map((field): ValidatorFunc => validatorFactory(field, params))
      : validatorFactory(fields, params)
  }
