import React, { FunctionComponent, useState } from 'react'
import { Form, Button, Dropdown } from 'semantic-ui-react'

import { useField } from '../../hooks/form'
import FieldWithError from '../form/FieldWithError'
import { handleValidated } from '../../util/error/validator'
import { Unit } from '../../types'

interface CreateIngredientFormProps {
  onCreate: (name: string, defaultUnit?: Unit) => void,
}

const CreateIngredientForm: FunctionComponent<CreateIngredientFormProps> = ({ onCreate }) => {
  const nameField = useField({ placeholder: 'name' })
  const [defaultUnit, setDefaultUnit] = useState<Unit | null>(null)

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    nameField.setError(null)

    handleValidated(
      async () => {
        await onCreate(nameField.value, defaultUnit || undefined)
        nameField.reset()
        setDefaultUnit(null)
      },
      (errors) => {
        if (errors.name) nameField.setError(errors.name)
      })
  }

  return (
    <Form onSubmit={submit}>
      <FieldWithError field={nameField} />
      <Dropdown />
      <Button positive>
        Create
      </Button>
    </Form>
  )
}

export default CreateIngredientForm
