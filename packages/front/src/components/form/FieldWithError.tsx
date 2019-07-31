import React from 'react'
import { Form, Message } from 'semantic-ui-react'
import { Field } from '../../hooks/form'

import './FieldWithError.less'

const FieldWithError = ({ field }: { field: Field }) => {
  return (
    <>
      <Form.Input
        className={`field-input${field.error ? ' with-error' : ''}`}
        fluid
        iconPosition='left'
        error={!!field.error}
        {...field.elementArgs}
      />
      {field.error && (
        <Message negative className='field-error' attached='bottom'>
          {field.error}
        </Message>
      )}
    </>
  )
}

export default FieldWithError
