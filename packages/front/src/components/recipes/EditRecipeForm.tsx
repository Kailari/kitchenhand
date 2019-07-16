import React, { FunctionComponent, useState } from 'react'
import { CheckboxProps, Header, Segment, Checkbox, Button } from 'semantic-ui-react'

import { Recipe, RecipeIngredient } from '../MainApp'
import IngredientList from './IngredientList'

import './EditRecipeForm.less'

type ID = string

interface EditRecipeFormProps {
  recipe: Recipe,
  setRecipe: (recipe: Recipe) => void | Promise<void>,
  ingredientFactory: () => (RecipeIngredient | null) | Promise<RecipeIngredient | null>,
  onCreateIngredient?: (newIngredient: RecipeIngredient) => void | Promise<void>,
  onRemoveIngredient?: (ingredientId: ID) => void | Promise<void>,
}

// TODO: make + button a menu with options for remove, add ingredient etc.
const EditRecipeForm: FunctionComponent<EditRecipeFormProps> = ({ recipe, setRecipe, ingredientFactory, onCreateIngredient, onRemoveIngredient }) => {
  const [showDelete, setShowDelete] = useState<boolean>(false)

  const toggleRemoval = (e: React.FormEvent, data: CheckboxProps) => {
    setShowDelete(data.checked as boolean)
  }

  const updateIngredients = (newIngredients: RecipeIngredient[]) => {
    if (recipe) {
      setRecipe({ ...recipe, ingredients: newIngredients })
    }
  }

  const addIngredient = async () => {
    const newIngredient = await ingredientFactory()
    if (newIngredient) {
      if (onCreateIngredient) await onCreateIngredient(newIngredient)
      updateIngredients(recipe.ingredients.concat(newIngredient))
    }
  }

  const removeIngredient = async (ingredientId: ID) => {
    if (onRemoveIngredient) await onRemoveIngredient(ingredientId)
    updateIngredients(recipe.ingredients.concat().filter((i) => i.id !== ingredientId))
  }

  return (
    <>
      <Header as='h2'>Basic info</Header>
      <Segment>
        {recipe.name}<br />
        {recipe.description}
      </Segment>
      <Header as='h2'>Ingredients</Header>
      <Segment className='clearfix'>
        <IngredientList
          showDelete={showDelete}
          onRemove={removeIngredient}
          ingredients={recipe.ingredients}
          setIngredients={updateIngredients}
        />
        <div className='ingredient-controls'>
          <Checkbox toggle label='Remove ingredients' onChange={toggleRemoval} />
          <Button className='add' onClick={addIngredient}>
            Add new ingredient
          </Button>
        </div>
      </Segment>
      <Header as='h2'>Method</Header>
      <Segment>
        TODO
      </Segment>
    </>
  )
}

export default EditRecipeForm
