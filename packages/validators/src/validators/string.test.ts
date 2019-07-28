import string, { StringValidationParameters } from './string'
import { ValidatorFunc } from '../validator'

const FIELD_NAME = 'stringField'

describe('validator passes with no errors', () => {
  test('when field has a null-value', () => {
    const onError = jest.fn()
    const validator = string(FIELD_NAME, {}) as ValidatorFunc
    validator({
      [FIELD_NAME]: null
    }, onError)
    expect(onError).not.toBeCalled()
  })

  test('when field is undefined', () => {
    const onError = jest.fn()
    const validator = string(FIELD_NAME, {}) as ValidatorFunc
    validator({}, onError)
    expect(onError).not.toBeCalled()
  })
})

describe('when configured to allow empty strings', () => {
  const params: StringValidationParameters = {
    allowEmpty: true,
  }

  test('validator accepts an empty string', () => {
    const onError = jest.fn()
    const validator = string(FIELD_NAME, params) as ValidatorFunc
    validator({ [FIELD_NAME]: '' }, onError)
    expect(onError).not.toBeCalled()
  })
})

describe('when configured not to allow empty strings', () => {
  const params: StringValidationParameters = {
    allowEmpty: false,
  }

  describe('validator rejects empty strings', () => {
    test('with correct field name', () => {
      const onError = jest.fn()
      const validator = string(FIELD_NAME, params) as ValidatorFunc
      validator({ [FIELD_NAME]: '' }, onError)
      expect(onError).toBeCalledWith(FIELD_NAME, expect.any(String))
    })

    test('with proper error message', () => {
      const onError = jest.fn()
      const validator = string(FIELD_NAME, params) as ValidatorFunc
      validator({ [FIELD_NAME]: '' }, onError)
      expect(onError).toBeCalledWith(expect.any(String), expect.stringContaining('cannot_be_empty'))
    })
  })
})

describe('when configured with minimum length', () => {
  const params: StringValidationParameters = {
    minLength: 5,
  }

  describe('validator rejects too short strings', () => {
    test('with correct field name', () => {
      const onError = jest.fn()
      const validator = string(FIELD_NAME, params) as ValidatorFunc
      validator({ [FIELD_NAME]: 'a' }, onError)
      expect(onError).toBeCalledWith(FIELD_NAME, expect.any(String))
    })

    test('with proper error message', () => {
      const onError = jest.fn()
      const validator = string(FIELD_NAME, params) as ValidatorFunc
      validator({ [FIELD_NAME]: 'a' }, onError)
      expect(onError).toBeCalledWith(expect.any(String), expect.stringContaining('too_short'))
      expect(onError).toBeCalledWith(expect.any(String), expect.stringContaining(`${params.minLength}`))
    })
  })

  test('validator accepts strings with exactly the minimum length', () => {
    const onError = jest.fn()
    const validator = string(FIELD_NAME, params) as ValidatorFunc
    validator({ [FIELD_NAME]: '12345' }, onError)
    expect(onError).not.toBeCalled()
  })

  test('validator accepts strings longer than the minimum length', () => {
    const onError = jest.fn()
    const validator = string(FIELD_NAME, params) as ValidatorFunc
    validator({ [FIELD_NAME]: '1234567890' }, onError)
    expect(onError).not.toBeCalled()
  })

  test('setting allowEmpty throws a warning when creating the validator', () => {
    expect(() => string(FIELD_NAME, { minLength: 5, allowEmpty: true })).toThrow()
    expect(() => string(FIELD_NAME, { minLength: 5, allowEmpty: false })).toThrow()
  })
})

describe('when configured with maximum length', () => {
  const params: StringValidationParameters = {
    maxLength: 5,
  }

  describe('validator rejects too long strings', () => {
    test('with correct field name', () => {
      const onError = jest.fn()
      const validator = string(FIELD_NAME, params) as ValidatorFunc
      validator({ [FIELD_NAME]: '123456' }, onError)
      expect(onError).toBeCalledWith(FIELD_NAME, expect.any(String))
    })

    test('with proper error message', () => {
      const onError = jest.fn()
      const validator = string(FIELD_NAME, params) as ValidatorFunc
      validator({ [FIELD_NAME]: '123456' }, onError)
      expect(onError).toBeCalledWith(expect.any(String), expect.stringContaining('too_long'))
      expect(onError).toBeCalledWith(expect.any(String), expect.stringContaining(`${params.maxLength}`))
    })
  })

  test('validator accepts strings with exactly the maximum length', () => {
    const onError = jest.fn()
    const validator = string(FIELD_NAME, params) as ValidatorFunc
    validator({ [FIELD_NAME]: '12345' }, onError)
    expect(onError).not.toBeCalled()
  })

  test('validator accepts strings shorter than the maximum length', () => {
    const onError = jest.fn()
    const validator = string(FIELD_NAME, params) as ValidatorFunc
    validator({ [FIELD_NAME]: '123' }, onError)
    expect(onError).not.toBeCalled()
  })

  test('setting minLength to a higher value throws an error when creating the validator', () => {
    expect(() => string(FIELD_NAME, { minLength: 5, maxLength: 3 })).toThrow()
  })

  test('setting minLength and maxLength to the same value does not throw an error', () => {
    expect(() => string(FIELD_NAME, { minLength: 5, maxLength: 5 })).not.toThrow()
  })
})

describe('when configured with a regex', () => {
  const params: StringValidationParameters = {
    regex: /^[a-d]*$/,
  }

  describe('validator rejects non-matching strings', () => {
    test('with correct field name', () => {
      const onError = jest.fn()
      const validator = string(FIELD_NAME, params) as ValidatorFunc
      validator({ [FIELD_NAME]: 'efgh' }, onError)
      expect(onError).toBeCalledWith(FIELD_NAME, expect.any(String))
    })

    test('with proper error message', () => {
      const onError = jest.fn()
      const validator = string(FIELD_NAME, params) as ValidatorFunc
      validator({ [FIELD_NAME]: 'efgh' }, onError)
      expect(onError).toBeCalledWith(expect.any(String), expect.stringContaining('no_match'))
    })
  })

  test('validator accepts matching strings', () => {
    const onError = jest.fn()
    const validator = string(FIELD_NAME, params) as ValidatorFunc
    validator({ [FIELD_NAME]: 'aabbccdd' }, onError)
    expect(onError).not.toBeCalled()
  })

  test('validator still produces min/maxLength errors', () => {
    const onError = jest.fn()
    const validator = string(FIELD_NAME, {
      ...params,
      minLength: 3,
      maxLength: 5,
    }) as ValidatorFunc
    validator({ [FIELD_NAME]: 'aabbccdd' }, onError)
    expect(onError).toBeCalledWith(FIELD_NAME, expect.stringContaining('too_long'))
    validator({ [FIELD_NAME]: 'a' }, onError)
    expect(onError).toBeCalledWith(FIELD_NAME, expect.stringContaining('too_short'))
  })

  test('validator still produces allowEmpty errors when minLength is not set', () => {
    const onError = jest.fn()
    const validator = string(FIELD_NAME, {
      ...params,
      allowEmpty: false,
    }) as ValidatorFunc
    validator({ [FIELD_NAME]: '' }, onError)
    expect(onError).toBeCalledWith(FIELD_NAME, expect.stringContaining('cannot_be_empty'))
  })

  test('validator produces allowEmpty, maxLength and regex errors when appropriate', () => {
    const onError = jest.fn()
    const validator = string(FIELD_NAME, {
      ...params,
      allowEmpty: false,
      maxLength: 5,
    }) as ValidatorFunc
    validator({ [FIELD_NAME]: '' }, onError)
    expect(onError).toBeCalledWith(FIELD_NAME, expect.stringContaining('cannot_be_empty'))
    validator({ [FIELD_NAME]: 'aabbccdd' }, onError)
    expect(onError).toBeCalledWith(FIELD_NAME, expect.stringContaining('too_long'))
    validator({ [FIELD_NAME]: 'efgh123' }, onError)
    expect(onError).toBeCalledWith(FIELD_NAME, expect.stringContaining('no_match'))
  })
})
