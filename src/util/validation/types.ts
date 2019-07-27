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
