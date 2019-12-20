import React, { FunctionComponent, useState } from 'react'
import { Segment, Input, Icon, Label, Button } from 'semantic-ui-react'

import './IngredientEntry.less'
import SelectUnitDropdown from '../units/SelectUnitDropdown'
import { Unit, Ingredient, RecipeIngredient } from '../../types'
import SelectIngredientDropdown from '../ingredients/SelectIngredientDropdown'

interface IngredientEntryProps {
  recipeIngredient: RecipeIngredient,
  showDelete: boolean,
  setAmount: (amount: number) => void,
  setUnit: (unit: Unit) => void,
  setIngredient: (ingredient: Ingredient) => void,
  onRemove: () => void,
  onMoveUp: () => void,
  onMoveDown: () => void,
}

const IngredientEntry: FunctionComponent<IngredientEntryProps> = ({
  recipeIngredient,
  showDelete,
  onRemove,
  setAmount,
  setUnit,
  setIngredient,
  onMoveUp,
  onMoveDown,
}) => {
  const [cachedAmountString, setCachedAmountString] = useState<string>(`${recipeIngredient.amount}`)

  const ButtonControls = () => (
    <div>
      <Icon name='arrow circle up' size='large' onClick={onMoveUp} />
      <Icon name='arrow circle down' size='large' onClick={onMoveDown} />
    </div>
  )

  return (
    <Segment circular className='ingredient-entry'>
      <ButtonControls />
      <div className='inputs'>
        <Input
          type='number'
          placeholder='150'
          labelPosition='right'
          className='amount'
          value={cachedAmountString}
          onChange={(e) => {
            if (e.target.value === '') {
              setAmount(0)
              setCachedAmountString('')
            } else if (e.target.value.match('-?(\\d+|\\d+\\.\\d+|\\.\\d+)([eE][-+]?\\d+)?')) {
              setAmount(e.target.valueAsNumber)
              setCachedAmountString(e.target.value)
            } else {
              setAmount(0)
              setCachedAmountString('0')
            }
          }} />
        <SelectUnitDropdown
          className='unit'
          select={(u) => u ? setUnit(u) : () => { }}
          selected={recipeIngredient.unit}
          selection
          compact
        />
        <Label className='of'>of</Label>
        <SelectIngredientDropdown
          className='ingredient'
          select={(i) => i ? setIngredient(i) : () => { }}
          selected={recipeIngredient.ingredient}
          selection
          compact
        />
        <Button icon='plus' size='mini' />
      </div>
      {showDelete && (
        <Button negative onClick={onRemove}>Remove</Button>
      )}
    </Segment>
  )
}

export default IngredientEntry
