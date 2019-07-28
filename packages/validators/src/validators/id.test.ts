import isValidId from './id'
import { ValidatorFunc, ErrorConsumer } from '../validator'

const VALID_ID = '5d03492506c82c187d8d6291'
const INVALID_ID = 'A VERY INVALID ID'

const ID_FIELD_NAME = 'idField'

let onError: ErrorConsumer
let validator: ValidatorFunc
beforeEach(() => {
  onError = jest.fn()
  validator = isValidId(ID_FIELD_NAME) as ValidatorFunc
})

describe('isValidId passes with no errors', () => {
  test('when ID field has a null-value', () => {
    validator({
      [ID_FIELD_NAME]: null
    }, onError)
    expect(onError).not.toBeCalled()
  })

  test('when ID field is undefined', () => {
    validator({}, onError)
    expect(onError).not.toBeCalled()
  })

  test('when ID field is a string representing a valid ObjectID', () => {
    validator({
      [ID_FIELD_NAME]: VALID_ID
    }, onError)
    expect(onError).not.toBeCalled()
  })
})

describe('isValidId calls error consumer', () => {
  test('when given an invalid ID', () => {
    validator({
      [ID_FIELD_NAME]: INVALID_ID
    }, onError)
    expect(onError).toBeCalled()
  })

  test('when given an empty string', () => {
    validator({
      [ID_FIELD_NAME]: ''
    }, onError)
    expect(onError).toBeCalled()
  })

  test('with correct field name', () => {
    validator({
      [ID_FIELD_NAME]: INVALID_ID
    }, onError)
    expect(onError).toBeCalledWith(ID_FIELD_NAME, expect.any(String))
  })

  test('with proper error message when given an invalid ID', () => {
    validator({
      [ID_FIELD_NAME]: INVALID_ID
    }, onError)
    expect(onError).toBeCalledWith(expect.any(String), expect.stringContaining('malformed_id'))
  })

  test('with proper error message when given an empty string', () => {
    validator({
      [ID_FIELD_NAME]: ''
    }, onError)
    expect(onError).toBeCalledWith(expect.any(String), expect.stringContaining('cannot_be_empty'))
  })
})
