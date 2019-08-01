import React, { FunctionComponent, useState } from 'react'
import { Form, Button, Loader } from 'semantic-ui-react'

import { useField } from '../../hooks/form'
import FieldWithError from '../form/FieldWithError'
import { handleValidated } from '../../util/error/validator'
import { Unit } from '../../types'
import SelectUnitDropdown from '../units/SelectUnitDropdown'
import UnitsQuery, { ALL_UNITS } from '../units/UnitsQuery'

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
    <UnitsQuery query={ALL_UNITS} render={(result) =>
      (result.loading || !result.data)
        ? <Loader active inline>Loading...</Loader>
        : <>
          <Form onSubmit={submit}>
            <FieldWithError field={nameField} />
            <SelectUnitDropdown
              units={result.data.units}
              select={setDefaultUnit}
              selected={defaultUnit}
              fluid
              selection
              style={{ marginBottom: '14px' }}
            />
            <Button positive>
              Create
            </Button>
          </Form>
        </>
    } />
  )
}

export default CreateIngredientForm
