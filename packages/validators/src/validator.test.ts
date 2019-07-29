import 'jest-extended' // FIXME: ESLint in VSCode sometimes fails if this is not here
import { doValidation } from './index'
import { createValidator, createParameterizedValidator, ValidatorFuncFactory, ParameterizedValidatorFuncFactory } from './validator'
import { ValidationError } from './error'

describe('ValidatorFuncFactory created with createValidator', () => {
  test('outputs a single validator when given a single field', () => {
    const validator = createValidator(() => () => { })('fieldName')
    expect(validator).not.toBeArray()
  })

  test('calls validatorFactory once when given a single field', () => {
    const validatorFactory = jest.fn()
    createValidator(validatorFactory)('fieldName')
    expect(validatorFactory).toBeCalledTimes(1)
  })

  test('outputs a validator for every string in an array', () => {
    const validators = createValidator(() => () => { })(['fieldName', 'anotherField', 'thirdField', 'fourthField'])
    expect(validators).toBeArrayOfSize(4)
  })

  test('calls validatorFactory for every string in an array', () => {
    const validatorFactory = jest.fn()
    createValidator(validatorFactory)(['fieldName', 'anotherField', 'thirdField', 'fourthField'])
    expect(validatorFactory).toBeCalledTimes(4)
  })

  describe('can be used to create a working validator', () => {
    test('which can fail calling error consumer', () => {
      const onError = jest.fn()
      const validator =
        (createValidator((field) =>
          (args, error) => { error(field, `${field} failed to validate`) }
        ) as ValidatorFuncFactory)('field')
      validator({}, onError)
      expect(onError).toBeCalledTimes(1)
    })

    test('which can pass without errors', () => {
      const onError = jest.fn()
      const validator =
        (createValidator(() => () => { }) as ValidatorFuncFactory)('field')
      validator({}, onError)
      expect(onError).not.toBeCalled()
    })
  })
})

describe('ParameterizedValidatorFuncFactory created with createParameterizedValidator', () => {
  const params = {
    field: 'a very correct value'
  }

  test('outputs a single validator when given a single field', () => {
    const validator = createParameterizedValidator(() => () => { })('fieldName', params)
    expect(validator).not.toBeArray()
  })

  test('calls validatorFactory once when given a single field', () => {
    const validatorFactory = jest.fn()
    createParameterizedValidator(validatorFactory)('fieldName', params)
    expect(validatorFactory).toBeCalledTimes(1)
  })

  test('outputs a validator for every string in an array', () => {
    const validators = createParameterizedValidator(() => () => { })(['fieldName', 'anotherField', 'thirdField', 'fourthField'], params)
    expect(validators).toBeArrayOfSize(4)
  })

  test('calls validatorFactory for every string in an array', () => {
    const validatorFactory = jest.fn()
    createParameterizedValidator(validatorFactory)(['fieldName', 'anotherField', 'thirdField', 'fourthField'], params)
    expect(validatorFactory).toBeCalledTimes(4)
  })

  test('calls validatorFactory with correct params', () => {
    const validatorFactory = jest.fn()
    createParameterizedValidator(validatorFactory)('fieldName', params)
    expect(validatorFactory).toBeCalledWith('fieldName', params)
  })

  describe('can be used to create a working validator', () => {
    test('which can fail calling error consumer', () => {
      const onError = jest.fn()
      const validator =
        (createParameterizedValidator((field) =>
          (args, error) => { error(field, `${field} failed to validate`) }
        ) as ParameterizedValidatorFuncFactory<unknown>)('field', params)
      validator({}, onError)
      expect(onError).toBeCalledTimes(1)
    })

    test('which can pass without errors', () => {
      const onError = jest.fn()
      const validator =
        (createParameterizedValidator(() => () => { }) as ParameterizedValidatorFuncFactory<unknown>)('field', params)
      validator({}, onError)
      expect(onError).not.toBeCalled()
    })
  })
})

const validator: { success: ValidatorFuncFactory, failing: ValidatorFuncFactory } = {
  success: (_field) => (_args, _error) => { },
  failing: (field) => (args, error) => { error(field, `${field} failed to validate`) },
}

describe('doValidation', () => {
  describe('when given a single validator', () => {
    const args = {
      field1: 'field #1',
      field2: 'field #2',
    }

    describe('if the validator fails', () => {
      const validation = () => doValidation(args, [validator.failing('field1')])

      test('throws ValidationError', () => {
        expect(validation).toThrowError(ValidationError)
      })

      test('thrown error containins a state object', () => {
        try {
          validation()
        } catch (error) {
          expect(error.extensions.state).toEqual(expect.any(Object))
        }
      })

      test('thrown error\'s state object contains the error message', () => {
        try {
          validation()
        } catch (error) {
          expect(error.extensions.state.field1).toEqual(['field1 failed to validate'])
        }
      })

      test('thrown error\'s state object does not contain keys for fields that did not fail to validate', () => {
        try {
          validation()
        } catch (error) {
          expect(error.extensions.state.field2).not.toBeDefined()
        }
      })
    })

    test('does not throw if validator succeeds', () => {
      expect(() => doValidation(args, [validator.success('field1')])).not.toThrow()
    })
  })

  describe('when given an array of validators', () => {
    const args = {
      field1: 'field #1',
      field2: 'field #2',
      field3: 'field #3',
    }

    describe('if all of the validators fail', () => {
      const validation = () => doValidation(args, [
        validator.failing('field1'),
        validator.failing('field1'),
        validator.failing('field1'),
        validator.failing('field2'),
      ])

      test('throws ValidationError', () => {
        expect(validation).toThrowError(ValidationError)
      })

      test('thrown error\'s state object contains the error messages for all errors', () => {
        try {
          validation()
        } catch (error) {
          const state = error.extensions.state
          expect(state.field1).toEqual([
            'field1 failed to validate',
            'field1 failed to validate',
            'field1 failed to validate',
          ])
          expect(state.field2).toEqual([
            'field2 failed to validate',
          ])
          expect(state.field3).not.toBeDefined()
        }
      })

      test('thrown error\'s state object does not contain keys for fields that did not fail to validate', () => {
        try {
          validation()
        } catch (error) {
          expect(error.extensions.state.field3).not.toBeDefined()
        }
      })
    })

    describe('if only some of the validators fail', () => {
      const validation = () => doValidation(args, [
        validator.failing('field1'),
        validator.failing('field1'),
        validator.success('field1'),
        validator.success('field2'),
        validator.failing('field2'),
        validator.success('field3'),
        validator.success('field3'),
      ])

      test('throws ValidationError', () => {
        expect(validation).toThrowError(ValidationError)
      })

      test('thrown error\'s state object contains the error messages for all errors', () => {
        try {
          validation()
        } catch (error) {
          const state = error.extensions.state
          expect(state).toBeDefined()
          expect(state.field1).toEqual([
            'field1 failed to validate',
            'field1 failed to validate',
          ])
          expect(state.field2).toEqual([
            'field2 failed to validate',
          ])
        }
      })

      test('thrown error\'s state object does not contain keys for fields that did not fail to validate', () => {
        try {
          validation()
        } catch (error) {
          expect(error.extensions.state.field3).not.toBeDefined()
        }
      })
    })

    test('does not throw if all validators succeed', () => {
      expect(() => doValidation(args, [
        validator.success('field1'),
        validator.success('field1'),
        validator.success('field1'),
        validator.success('field2'),
      ])).not.toThrow()
    })
  })
})
