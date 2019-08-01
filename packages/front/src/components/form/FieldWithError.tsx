import React, { FunctionComponent } from 'react'
import { Form, Message, FormInputProps } from 'semantic-ui-react'

import { Field } from '../../hooks/form'

import './FieldWithError.less'

interface FieldWithErrorProps extends FormInputProps {
  field: Field,
}

const FieldWithError: FunctionComponent<FieldWithErrorProps> = ({ field, ...args }) => {
  return (
    <div className='field'>
      <Form.Input
        className={`field-input${field.error ? ' with-error' : ''}`}
        fluid
        iconPosition='left'
        error={!!field.error}
        {...args}
        {...field.elementArgs}
      />
      {field.error && (
        <Message negative className='field-error' attached='bottom'>
          {field.error}
        </Message>
      )}
    </div>
  )
}

export default FieldWithError
