import React, { FunctionComponent } from 'react'
import { Segment, Input, Icon, Label, Button, Responsive } from 'semantic-ui-react'

import './IngredientEntry.less'

interface IngredientEntryProps {
  showDelete: boolean,
  onRemove: () => void,
  setDraggedElement: () => void,
  onDragOver: (index: number) => void,
  amount: number,
  setAmount: (amount: number) => void,
}

const IngredientEntry: FunctionComponent<IngredientEntryProps> = ({ showDelete, onRemove, setDraggedElement, onDragOver, amount, setAmount }) => {
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
        <Input type='number' placeholder='150' labelPosition='right' className='amount' value={amount} onChange={(e) => setAmount(e.target.valueAsNumber)}>
          <input />
        </Input>
        <Input list='units' placeholder='grams' labelPosition='right' className='unit'>
          <input />
        </Input>
        <datalist id='units'>
          <option value='grams' />
          <option value='liters' />
          <option value='desiliters' />
          <option value='milliliters' />
        </datalist>
        <Input list='ingredients' placeholder='ingredient' labelPosition='right' className='ingredient'>
          <Label>of</Label>
          <input />
          <Button icon='plus' size='mini' />
        </Input>
        <datalist id='ingredients'>
          <option value='Cheese' />
          <option value='Butter' />
          <option value='Pasta' />
        </datalist>
      </div>
      {showDelete && (
        <Button negative onClick={onRemove}>Remove</Button>
      )}
    </Segment>
  )
}

export default IngredientEntry
