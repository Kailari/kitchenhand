import React, { FunctionComponent, useState, useRef } from 'react'
import { Header, Segment, Checkbox, Button, Input, SegmentGroup, Icon, Modal, Form } from 'semantic-ui-react'

import { Recipe, RecipeIngredient, Dirty, ID, Unit, Ingredient } from '../../types'
import { useStateWithDelayedCallback } from '../../hooks/delayedCallbackState'
import { handleValidated } from '../../util/error/validator'
import IngredientEntry from './IngredientEntry'
import FieldWithError from '../form/FieldWithError'
import { useField } from '../../hooks/form'

import './EditRecipeForm.less'
import SelectUnitDropdown from '../units/SelectUnitDropdown'
import SelectIngredientDropdown from '../ingredients/SelectIngredientDropdown'

interface EditRecipeFormProps {
  recipe: Recipe,
  onUpdateName?: (newName: string) => void,
  onUpdateSummary?: (newSummary: string) => void,
  onCreateIngredient?: (index: number, amount: number, ingredient: Ingredient, unit: Unit) => RecipeIngredient | Promise<RecipeIngredient>,
  onRemoveIngredient?: (recipeIngredientId: ID) => void | Promise<void>,
  onUpdateIngredient?: (id: ID, updated: Dirty<RecipeIngredient>) => void | Promise<void>,
}

interface EditRecipeBasicInfoProps {
  name: string,
  summary?: string,
  onUpdateName?: (name: string) => void,
  onUpdateSummary?: (newSummary: string) => void,
}

const BasicInfoControls: FunctionComponent<EditRecipeBasicInfoProps> = ({
  name: recipeName,
  summary: recipeSummary,
  onUpdateName,
  onUpdateSummary,
}) => {
  const [nameError, setNameError] = useState<string | null>(null)
  const [summaryError, setSummaryError] = useState<string | null>(null)

  const handleUpdateName = (name: string) => {
    handleValidated(
      async () => {
        if (onUpdateName) {
          await onUpdateName(name)
        }
        setNameError(null)
      },
      (errors) => errors.name && setNameError(errors.name)
    )
  }

  const handleUpdateSummary = (summary: string) => {
    handleValidated(
      async () => {
        if (onUpdateSummary) {
          await onUpdateSummary(summary)
        }
        setSummaryError(null)
      },
      (errors) => errors.description && setSummaryError(errors.description)
    )
  }

  const [name, setName] = useStateWithDelayedCallback<string>(recipeName, handleUpdateName)
  const [summary, setSummary] = useStateWithDelayedCallback<string>(recipeSummary, handleUpdateSummary)

  return (
    <>
      <Header as='h2'>Basic info</Header>
      <SegmentGroup>
        <Segment className='basic-info-controls'>
          <Input
            className='name'
            placeholder='My awesome recipe'
            value={name}
            onChange={(e, { value }) => setName(value)}
            labelPosition='left'
            fluid
            label='Name*'
          />
          {nameError &&
            <>
              <small className='input-description input-error'>
                {nameError}
              </small>
              <br />
            </>
          }
          <small className='input-description'>
            The name of your recipe.
          </small>
          <Input
            className='summary'
            placeholder={'It\'s a bit like pasta, but still like pizza, but still a bit more of a soup'}
            value={summary || ''}
            onChange={(e, { value }) => setSummary(value)}
            fluid
            label='Summary*'
          />
          {summaryError &&
            <>
              <small className='input-description input-error'>
                {summaryError}
              </small>
              <br />
            </>
          }
          <small className='input-description'>
            A brief summary or one-liner describing the recipe.
          </small>
        </Segment>
        <Segment className='footnote'>
          <i><span style={{ fontSize: 'larger' }}>*</span> denotes a required field</i>
        </Segment>
      </SegmentGroup>
    </>
  )
}


interface AddIngredientModalProps {
  onAddIngredient: (amount: number, ingredient: Ingredient, unit: Unit) => void | Promise<void>,
}

const AddIngredientModal: FunctionComponent<AddIngredientModalProps> = ({
  onAddIngredient,
}) => {
  const amountField = useField({ label: 'Amount', type: 'number', placeholder: 'amount' }, '10')
  const [unit, setUnit] = useState<Unit>()
  const [open, setOpen] = useState<boolean>()
  const [ingredient, setIngredient] = useState<Ingredient>()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!unit) {
      return
    }

    if (!ingredient) {
      return
    }

    await onAddIngredient(Number(amountField.value), ingredient, unit)
    setOpen(false)
  }

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      trigger={
        <Button
          positive
          className='add'
          onClick={() => setOpen(true)}
        >
          Add new ingredient
        </Button>
      }
    >
      <Modal.Header>Add an Ingredient</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Form onSubmit={handleSubmit}>
            <FieldWithError field={amountField} />
            <Form.Field>
              <label>Unit</label>
              <SelectUnitDropdown
                selected={unit || null}
                select={(value) => {
                  if (value) {
                    setUnit(value)
                  }
                }}
                selection
                compact
              />
            </Form.Field>
            <Form.Field>
              <label>Ingredient</label>
              <SelectIngredientDropdown
                selected={ingredient || null}
                select={(value) => {
                  if (value) {
                    setIngredient(value)
                  }
                }}
                selection
                compact
              />
            </Form.Field>
            <Form.Button type='submit' positive>Submit</Form.Button>
          </Form>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  )
}


interface EditRecipeIngredientProps {
  ingredients: RecipeIngredient[],
  onCreateIngredient?: (index: number, amount: number, ingredient: Ingredient, unit: Unit) => RecipeIngredient | Promise<RecipeIngredient>,
  onRemoveIngredient?: (id: ID) => void | Promise<void>,
  onUpdateIngredient?: (id: ID, updated: Dirty<RecipeIngredient>) => void | Promise<void>,
}

const IngredientControls: FunctionComponent<EditRecipeIngredientProps> = ({
  ingredients: recipeIngredients,
  onCreateIngredient,
  onRemoveIngredient,
  onUpdateIngredient,
}) => {
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>(recipeIngredients)
  const changes = useRef<Map<ID, Dirty<RecipeIngredient>>>(new Map())
  const changesTimeout = useRef<NodeJS.Timeout>()

  const [showDelete, setShowDelete] = useState<boolean>(false)

  const appendChanges = (id: ID, updated: Dirty<RecipeIngredient>, updateLocalState: boolean = true) => {
    const newChanges = new Map(changes.current)
    if (newChanges.has(id)) {
      const existingChanges = newChanges.get(id)
      const combined = {
        ...existingChanges,
        ...updated
      }
      newChanges.set(id, combined)
    } else {
      newChanges.set(id, updated)
    }
    changes.current = newChanges

    if (onUpdateIngredient) {
      if (changesTimeout.current) clearTimeout(changesTimeout.current)
      changesTimeout.current = setTimeout(() => {
        // FIXME: We are doing one query per updated ingredient, this is wasteful. Do batch updates instead.
        for (const [key, delta] of newChanges) {
          onUpdateIngredient(key, delta)
        }
        changes.current.clear()
      }, 1000)
    }

    if (updateLocalState) {
      const newIngredients = ingredients.concat().map(
        (i) => i.id === id ? { ...i, ...updated } : i)
      setIngredients(newIngredients)
    }
  }

  const swapIndicesOf = (ingredient: RecipeIngredient, target: RecipeIngredient) => {
    const ingredientIndex = ingredient.index
    const targetIndex = target.index
    appendChanges(ingredient.id, { index: targetIndex }, false)
    appendChanges(target.id, { index: ingredientIndex }, false)

    const newIngredients = ingredients.concat().map(
      (i) => i.id === ingredient.id
        ? { ...i, index: targetIndex }
        : i.id === target.id
          ? { ...i, index: ingredientIndex }
          : i)
    setIngredients(newIngredients)
  }

  const handleMoveIngredientUp = (ingredient: RecipeIngredient) => {
    const sorted = ingredients.concat().sort((a, b) => a.index - b.index)
    const ordinal = sorted.findIndex((i) => i.id === ingredient.id)
    if (ordinal > 0) {
      swapIndicesOf(ingredient, sorted[ordinal - 1])
    }
  }

  const handleMoveIngredientDown = (ingredient: RecipeIngredient) => {
    const sorted = ingredients.concat().sort((a, b) => a.index - b.index)
    const ordinal = sorted.findIndex((i) => i.id === ingredient.id)
    if (ordinal < ingredients.length - 1) {
      swapIndicesOf(ingredient, sorted[ordinal + 1])
    }
  }

  const handleRemoveIngredient = (recipeIngredient: RecipeIngredient) => {
    if (onRemoveIngredient) {
      onRemoveIngredient(recipeIngredient.id)
    }
    const newIngredients = ingredients.concat().filter((i) => i.id !== recipeIngredient.id)
    setIngredients(newIngredients)
  }

  const handleAddIngredient = async (amount: number, ingredient: Ingredient, unit: Unit) => {
    if (onCreateIngredient) {
      const added = await onCreateIngredient(
        ingredients.length > 0
          ? ingredients.sort((a, b) => b.index - a.index)[0].index + 1
          : 0,
        amount,
        ingredient,
        unit,
      )

      const newIngredients = ingredients.concat()
      newIngredients.push(added)
      setIngredients(newIngredients)
    }
  }


  const ingredientPlaceholder = () => (
    <Segment placeholder>
      <Header icon>
        <Icon name='food' />
        At least one ingredient is required
      </Header>
    </Segment>)

  const ingredientList = () => (
    <Segment>
      {ingredients
        .concat()
        .sort((a, b) => a.index - b.index)
        .map((recipeIngredient) => (
          <IngredientEntry
            key={recipeIngredient.id}
            showDelete={showDelete}
            recipeIngredient={recipeIngredient}
            onRemove={() => handleRemoveIngredient(recipeIngredient)}
            onMoveUp={() => handleMoveIngredientUp(recipeIngredient)}
            onMoveDown={() => handleMoveIngredientDown(recipeIngredient)}
            setAmount={(amount) => appendChanges(recipeIngredient.id, { amount: amount })}
            setUnit={(unit) => appendChanges(recipeIngredient.id, { unit: unit })}
            setIngredient={(ingredient) => appendChanges(recipeIngredient.id, { ingredient: ingredient })}
          />
        ))}
    </Segment>)

  return (<>
    <Header as='h2'>Ingredients</Header>
    <SegmentGroup className='ingredients'>
      {ingredients.length > 0
        ? ingredientList()
        : ingredientPlaceholder()
      }
      <Segment className='ingredient-controls'>
        <Checkbox toggle label='Remove ingredients' onChange={() => setShowDelete(!showDelete)} />
        <AddIngredientModal
          onAddIngredient={handleAddIngredient}
        />
      </Segment>
    </SegmentGroup>
  </>)
}

// TODO: make + button a menu with options for remove, add ingredient etc.
const EditRecipeForm: FunctionComponent<EditRecipeFormProps> = ({
  recipe,
  onUpdateName,
  onUpdateSummary,
  onCreateIngredient,
  onRemoveIngredient,
  onUpdateIngredient,
}) => {
  return (
    <>
      <BasicInfoControls
        name={recipe.name}
        summary={recipe.description}
        onUpdateName={onUpdateName}
        onUpdateSummary={onUpdateSummary}
      />
      <IngredientControls
        ingredients={recipe.ingredients}
        onCreateIngredient={onCreateIngredient}
        onRemoveIngredient={onRemoveIngredient}
        onUpdateIngredient={onUpdateIngredient}
      />
      <Header as='h2'>Method</Header>
      <Segment>
        TODO
      </Segment>
    </>
  )
}

export default EditRecipeForm
