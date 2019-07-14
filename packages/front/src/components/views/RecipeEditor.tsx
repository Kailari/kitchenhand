import React, { FunctionComponent, useState } from 'react'
import { gql } from 'apollo-boost'
import { useMutation, useQuery } from 'react-apollo-hooks'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Header, Segment, Loader, Button, Checkbox, CheckboxProps } from 'semantic-ui-react'

import AddRecipeForm from '../recipes/AddRecipeForm'
import IngredientList from '../recipes/IngredientList'
import { NEW_RECIPES, MY_RECIPES } from '../recipes/RecipesQuery'
import { PageWithBreadcrumbsProps, PageWithHeadingAndBreadcrumb } from './PageBase'
import { Recipe, RecipeIngredient } from '../MainApp'

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
    ingredients {
      id
      amount
    }
  }
}`

const ADD_INGREDIENT = gql`
mutation addIngredient($recipeId: ID!) {
  recipeIngredient: addRecipeIngredient(recipeId: $recipeId) {
    id
    amount
    ingredient {
      id
      name
    }
    unit {
      id
      name
      abbreviation
    }
  }
}`


const REMOVE_INGREDIENT = gql`
mutation removeIngredient(
  $id: ID!
  $recipeId: ID!
) {
  id: removeRecipeIngredient(
    recipeId: $recipeId
    id: $id
  )
}`

interface FindRecipeResult {
  recipe?: Recipe,
}

interface AddIngredientResult {
  recipeIngredient?: RecipeIngredient,
}

interface RemoveIngredientResult {
  id?: string,
}

interface RecipeEditorProps extends PageWithBreadcrumbsProps, RouteComponentProps {
  recipeId?: string,
}

const RecipeEditor: FunctionComponent<RecipeEditorProps> = ({ history, breadcrumbs, recipeId }) => {
  const [showDelete, setShowDelete] = useState<boolean>(false)
  const [ingredients, setIngredients] = useState<RecipeIngredient[] | null>(null)

  const createMutation = useMutation<CreateRecipeResult>(CREATE_RECIPE, {
    refetchQueries: [
      { query: NEW_RECIPES },
      { query: MY_RECIPES },
    ]
  })

  const addIngredientMutation = useMutation<AddIngredientResult>(ADD_INGREDIENT)
  const removeIngredientMutation = useMutation<RemoveIngredientResult>(REMOVE_INGREDIENT)

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

  const addIngredient = async (recipeId: string) => {
    try {
      const result = await addIngredientMutation({
        variables: {
          recipeId
        }
      })

      if (recipeQuery.data && result.data) {
        const recipe = recipeQuery.data.recipe as Recipe
        const added = result.data.recipeIngredient as RecipeIngredient
        recipe.ingredients = (recipe.ingredients || []).concat(added)
        setIngredients(recipe.ingredients)
      }
    } catch (error) {
      console.log('error adding ingredient: ', error)
    }
  }

  const removeIngredient = async (recipeId: string, id: string) => {
    try {
      const result = await removeIngredientMutation({
        variables: {
          id,
          recipeId
        }
      })

      if (recipeQuery.data && result.data) {
        const recipe = recipeQuery.data.recipe as Recipe
        const removed = result.data.id
        console.log(result)
        if (removed) {
          recipe.ingredients = (recipe.ingredients || []).filter((i) => i.id !== removed)
          setIngredients(recipe.ingredients)
        }
      }
    } catch (error) {
      console.log('error adding ingredient: ', error)
    }
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
        <IngredientList
          showDelete={showDelete}
          onRemove={(id) => removeIngredient(recipe.id, id)}
          ingredients={ingredients || []}
          setIngredients={(newIngredients) => {
            recipe.ingredients = newIngredients
            setIngredients(newIngredients)
          }}
        />
        <div className='ingredient-controls'>
          <Checkbox toggle label='Remove ingredients' onChange={toggleRemoval} />
          <Button className='add' onClick={() => addIngredient(recipe.id)}>
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

  if (recipe && !ingredients) {
    setIngredients(recipe.ingredients || [])
  }

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
