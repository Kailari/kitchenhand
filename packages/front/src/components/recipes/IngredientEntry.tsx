import React, { FunctionComponent } from 'react'
import { Segment, Input, Icon, Label, Button, Responsive } from 'semantic-ui-react'

import './IngredientEntry.less'
import SelectUnitDropdown from '../units/SelectUnitDropdown'
import { Unit, Ingredient } from '../../types'
import SelectIngredientDropdown from '../ingredients/SelectIngredientDropdown'

interface IngredientEntryProps {
  showDelete: boolean,
  onRemove: () => void,
  setDraggedElement: () => void,
  onDragOver: (index: number) => void,
  amount: number,
  setAmount: (amount: number) => void,
  unit: Unit,
  setUnit: (unit: Unit) => void,
  ingredient: Ingredient,
  setIngredient: (ingredient: Ingredient) => void,
}

const IngredientEntry: FunctionComponent<IngredientEntryProps> = ({ showDelete, onRemove, setDraggedElement, onDragOver, amount, setAmount, unit, setUnit, ingredient, setIngredient }) => {
  const onDragStart = (e: React.DragEvent) => {
    setDraggedElement()
    e.dataTransfer.setData('text/html', (e.currentTarget.parentElement as Element).innerHTML)
    e.dataTransfer.setDragImage(e.currentTarget.parentElement as Element, 20, 20)
  }

  const onDragEnd = () => {
    console.log('foobar')
  }

  const DragAndDropControls = () => (
    <div
      className='controls'
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <Icon name='bars' size='large' />
    </div>
  )

  const ButtonControls = () => (
    <div>
      <Icon name='arrow circle up' size='large' />
      <Icon name='arrow circle down' size='large' />
    </div>
  )

  return (
    <Segment
      circular
      className='ingredient-entry'
      onDragOver={onDragOver}
    >
      <Responsive as={DragAndDropControls} minWidth={Responsive.onlyTablet.minWidth} />
      <Responsive as={ButtonControls} maxWidth={Responsive.onlyMobile.maxWidth} />
      <div className='inputs'>
        <Input type='number' placeholder='150' labelPosition='right' className='amount' value={amount} onChange={(e) => {
          if (e.target.value.match('-?(\\d+|\\d+\\.\\d+|\\.\\d+)([eE][-+]?\\d+)?')) {
            setAmount(e.target.valueAsNumber)
          } else {
            setAmount(0)
          }
        }}>
          <input />
        </Input>
        <SelectUnitDropdown
          className='unit'
          select={(u) => u ? setUnit(u) : () => { }}
          selected={unit}
          selection
          compact
        />
        <Label>of</Label>
        <SelectIngredientDropdown
          className='ingredient'
          select={(i) => i ? setIngredient(i) : () => { }}
          selected={ingredient}
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
