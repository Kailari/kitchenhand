import React from 'react'
import { Form, Message } from 'semantic-ui-react'

const FieldWithError = ({ field }) => {
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