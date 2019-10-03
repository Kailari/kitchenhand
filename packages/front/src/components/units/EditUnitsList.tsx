import React, { FunctionComponent } from 'react'
import { Segment, Button, Form } from 'semantic-ui-react'

import { Unit, Dirty, ID } from '../../types'

import './EditUnitsList.less'
import { useFieldWithDirty } from '../../hooks/form'
import FieldWithError from '../form/FieldWithError'
import { handleValidated } from '../../util/error/validator'

interface EditUnitEntryProps {
  unit: Unit,
  onUpdate: (id: ID, updated: Dirty<Unit>) => void,
  onRemove: (id: ID) => void,
}

const EditUnitEntry: FunctionComponent<EditUnitEntryProps> = ({ unit, onUpdate, onRemove }) => {
  const nameField = useFieldWithDirty({ placeholder: 'name' }, unit.name)
  const abbreviationField = useFieldWithDirty({ placeholder: 'name' }, unit.abbreviation || '')

  const update = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    nameField.setError(null)
    abbreviationField.setError(null)
    handleValidated(
      async () => {
        await onUpdate(unit.id, {
          name: nameField.dirty ? nameField.value : undefined,
          abbreviation: abbreviationField.dirty ? abbreviationField.value : undefined
        })
        nameField.clearDirty()
        abbreviationField.clearDirty()
      },
      (errors) => {
        if (errors.name) nameField.setError(errors.name)
        if (errors.abbreviation) abbreviationField.setError(errors.abbreviation)
      })
  }

  const remove = async () => {
    await onRemove(unit.id)
  }

  return (
    <Segment>
      <Form
        key={unit.id}
        className='unit-entry'
        onSubmit={update}
      >
        <div className='controls'>
          <FieldWithError field={nameField} />
          <FieldWithError field={abbreviationField} />
        </div>
        <Button type='submit' positive size='mini' className='save'>
          Save
        </Button>
        <Button negative size='mini' icon='trash' className='remove' onClick={remove} />
      </Form>
    </Segment>
  )
}

interface EditUnitsListProps {
  units: Unit[],
  onUpdate: (id: ID, updated: Dirty<Unit>) => void,
  onRemove: (id: ID) => void,
}

const EditUnitsList: FunctionComponent<EditUnitsListProps> = ({ units, onUpdate, onRemove }) => {
  return (
    <Segment>
      {units.map((unit) => <EditUnitEntry key={unit.id} unit={unit} onUpdate={onUpdate} onRemove={onRemove} />)}
    </Segment>
  )
}

export default EditUnitsList
