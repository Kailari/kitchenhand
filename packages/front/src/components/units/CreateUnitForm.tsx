import React, { FunctionComponent } from 'react'
import { Form, Button } from 'semantic-ui-react'
import { ApolloError } from 'apollo-client'

import { useField } from '../../hooks/form'
import FieldWithError from '../form/FieldWithError'

interface CreateUnitFormProps {
  onCreate: (name: string, abbreviation?: string) => void,
}

const CreateUnitForm: FunctionComponent<CreateUnitFormProps> = ({ onCreate }) => {
  const nameField = useField({ placeholder: 'name' })
  const abbreviationField = useField({ placeholder: 'abbreviation' })

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await onCreate(nameField.value, abbreviationField.value.length > 0 ? abbreviationField.value : undefined)
      nameField.reset()
      abbreviationField.reset()
    } catch (err) {
      if (err.graphQLErrors !== undefined) {
        const errors = (err as ApolloError).graphQLErrors
        for (const error of errors) {
          if (error.extensions && error.extensions.state && error.extensions.code === 'ARGUMENT_VALIDATION_FAILED') {
            const state = error.extensions.state
            if (state.name) nameField.setError(state.name)
            if (state.abbreviation) abbreviationField.setError(state.abbreviation)
          }
        }
      }
    }
  }

  return (
    <Form onSubmit={submit}>
      <FieldWithError field={nameField} />
      <FieldWithError field={abbreviationField} />
      <Button positive>
        Create
      </Button>
    </Form>
  )
}

export default CreateUnitForm
