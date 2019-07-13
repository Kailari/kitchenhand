import React, { FunctionComponent, useState } from 'react'
import { gql } from 'apollo-boost'
import { useMutation, useQuery } from 'react-apollo-hooks'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Header, Segment, Loader, Button, Checkbox, CheckboxProps } from 'semantic-ui-react'

import AddRecipeForm from '../recipes/AddRecipeForm'
import IngredientList from '../recipes/IngredientList'
import { NEW_RECIPES, MY_RECIPES } from '../recipes/RecipesQuery'
import { PageWithBreadcrumbsProps, PageWithHeadingAndBreadcrumb } from './PageBase'
import { Recipe } from '../MainApp'

import './RecipeEditor.less'

const CREATE_RECIPE = gql`
mutation create($name: String!, $description: String!) {
  addRecipe(
    name: $name,
    description: $description
  ) {
    id
    name
    description
  }
}`

interface CreateRecipeResult {
  addRecipe: {
    id: string,
    name: string,
    description?: string,
  },
}

const FIND_RECIPE = gql`
query find($id: ID!) {
  recipe(id: $id) {
    id
    name
    description
  }
}`

interface FindRecipeResult {
  recipe: Recipe | null,
}

export interface RecipeIngredient {
  id: string,
  amount: number,
}

interface RecipeEditorProps extends PageWithBreadcrumbsProps, RouteComponentProps {
  recipeId?: string,
}

const RecipeEditor: FunctionComponent<RecipeEditorProps> = ({ history, breadcrumbs, recipeId }) => {
  const [showDelete, setShowDelete] = useState<boolean>(false)
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([
    { id: '2137', amount: 100 },
    { id: '1324', amount: 200 },
    { id: '3424', amount: 300 }
  ])

  const createMutation = useMutation<CreateRecipeResult>(CREATE_RECIPE, {
    refetchQueries: [
      { query: NEW_RECIPES },
      { query: MY_RECIPES },
    ]
  })

  const recipeQuery = useQuery<FindRecipeResult>(FIND_RECIPE, {
    variables: {
      id: recipeId
    },
    skip: !recipeId
  })

  const createRecipe = async (name: string, description: string) => {
    const result = await createMutation({
      variables: {
        name,
        description
      }
    })

    if (!result.data) {
      // TODO: Error
      console.log('adding recipe failed')
      return
    }

    const newRecipe = result.data.addRecipe
    console.log('recipe: ', newRecipe)
    history.replace(`/recipes/${newRecipe.id}`)
  }

  const addForm = () => (
    <>
      <Header as='h2'>Basic info</Header>
      <AddRecipeForm onCreate={createRecipe} />
    </>
  )

  const addIngredient = () => {
    const newIngredients = ingredients.concat({
      id: `${ingredients.length * 1234}`, // TODO: generate an actual ID
      amount: ingredients.length * 100,
    })
    setIngredients(newIngredients)
  }

  const removeIngredient = (id: string) => {
    const ingredientsAfterRemoval = ingredients.filter((ingredient) => ingredient.id !== id)
    setIngredients(ingredientsAfterRemoval)
  }

  const toggleRemoval = (e: React.FormEvent, data: CheckboxProps) => {
    setShowDelete(data.checked as boolean)
  }

  // TODO: make + button a menu with options for remove, add ingredient etc.
  const editForm = (recipe: Recipe) => (
    <>
      <Header as='h2'>Basic info</Header>
      <Segment>
        {recipe.name}<br />
        {recipe.description}
      </Segment>
      <Header as='h2'>Ingredients</Header>
      <Segment className='clearfix'>
        <IngredientList showDelete={showDelete} onRemove={removeIngredient} ingredients={ingredients} setIngredients={setIngredients} />
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

  const recipe = !recipeQuery.loading && recipeQuery.data
    ? recipeQuery.data.recipe
    : null

  const title = recipeId
    ? <span>Editing: {recipe ? recipe.name : <Loader style={{ marginLeft: '10px' }} active inline size='small' />}</span>
    : <span>Create new recipe</span>

  return (
    <PageWithHeadingAndBreadcrumb
      title={title}
      breadcrumbs={breadcrumbs}
    >
      {!recipeId
        ? addForm()
        : recipe ? editForm(recipe) : <Loader active>Loading</Loader>
      }
    </PageWithHeadingAndBreadcrumb>
  )
}

export default withRouter(RecipeEditor)