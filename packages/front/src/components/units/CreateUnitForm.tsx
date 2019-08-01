import React, { FunctionComponent } from 'react'
import { Form, Button } from 'semantic-ui-react'

import { useField } from '../../hooks/form'
import FieldWithError from '../form/FieldWithError'
import { handleValidated } from '../../util/error/validator'

interface CreateUnitFormProps {
  onCreate: (name: string, abbreviation?: string) => void,
}

const CreateUnitForm: FunctionComponent<CreateUnitFormProps> = ({ onCreate }) => {
  const nameField = useField({ placeholder: 'name' })
  const abbreviationField = useField({ placeholder: 'abbreviation' })

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    nameField.setError(null)
    abbreviationField.setError(null)

    handleValidated(
      async () => {
        await onCreate(nameField.value, abbreviationField.value.length > 0 ? abbreviationField.value : undefined)
        nameField.reset()
        abbreviationField.reset()
      },
      (errors) => {
        if (errors.name) nameField.setError(errors.name)
        if (errors.abbreviation) abbreviationField.setError(errors.abbreviation)
      })
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
