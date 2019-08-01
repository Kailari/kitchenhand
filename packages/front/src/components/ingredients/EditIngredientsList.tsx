import React, { FunctionComponent, useState } from 'react'
import { Segment, Button, Form } from 'semantic-ui-react'

import { useFieldWithDirty } from '../../hooks/form'
import FieldWithError from '../form/FieldWithError'
import { handleValidated } from '../../util/error/validator'
import { Unit, DirtyFlags, Ingredient } from '../../types'

import './EditIngredientList.less'
import SelectUnitDropdown from './SelectUnitDropdown'

interface EditIngredientEntryProps {
  ingredient: Ingredient,
  onUpdate: (ingredient: Ingredient, dirty: DirtyFlags<Ingredient>) => void,
  onRemove: (ingredient: Ingredient) => void,
}

const EditIngredientEntry: FunctionComponent<EditIngredientEntryProps> = ({ ingredient, onUpdate, onRemove }) => {
  const nameField = useFieldWithDirty({ placeholder: 'name' }, ingredient.name)
  const [defaultUnit, setDefaultUnit] = useState<Unit | null>(ingredient.defaultUnit || null)

  const update = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    nameField.setError(null)
    handleValidated(
      async () => {
        const defaultUnitDirty = ingredient.defaultUnit !== defaultUnit
        ingredient.name = nameField.value
        ingredient.defaultUnit = defaultUnit || undefined
        await onUpdate(ingredient, {
          name: nameField.dirty,
          defaultUnit: defaultUnitDirty,
        })
        nameField.clearDirty()
      },
      (errors) => {
        if (errors.name) nameField.setError(errors.name)
      })
  }

  const remove = async () => {
    await onRemove(ingredient)
  }

  return (
    <Segment>
      <Form
        key={ingredient.id}
        className='edit-ingredient-entry'
        onSubmit={update}
      >
        <div className='controls'>
          <FieldWithError field={nameField} />
          <SelectUnitDropdown
            select={setDefaultUnit}
            selected={defaultUnit}
            selection
          />
        </div>
        <Button type='submit' positive size='mini' className='save'>
          Save
        </Button>
        <Button negative size='mini' icon='trash' className='remove' onClick={remove} />
      </Form>
    </Segment>
  )
}

interface EditIngredientListProps {
  ingredients: Ingredient[],
  onUpdate: (ingredient: Ingredient, dirty: DirtyFlags<Ingredient>) => void,
  onRemove: (ingredient: Ingredient) => void,
}

const EditIngredientsList: FunctionComponent<EditIngredientListProps> = ({ ingredients, onUpdate, onRemove }) => {
  return (
    <Segment>
      {ingredients.map((ingredient) =>
        <EditIngredientEntry
          key={ingredient.id}
          ingredient={ingredient}
          onUpdate={onUpdate}
          onRemove={onRemove} />)
      }
    </Segment>
  )
}

export default EditIngredientsList
