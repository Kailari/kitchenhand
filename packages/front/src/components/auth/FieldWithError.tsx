import React from 'react'
import { Form, Message } from 'semantic-ui-react'
import { Field } from '../../hooks/form'

const FieldWithError = ({ field }: { field: Field }) => {
  return (
    <>
      <Form.Input
        fluid
        iconPosition='left'
        {...field.elementArgs}
      />
      {field.error && (
        <Message>
          {field.error}
        </Message>
      )}
    </>
  )
}

export default FieldWithError
