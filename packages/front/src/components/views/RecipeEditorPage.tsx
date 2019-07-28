import React, { FunctionComponent, useState } from 'react'
import gql from 'graphql-tag'
import { useMutation, useQuery } from 'react-apollo-hooks'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Loader } from 'semantic-ui-react'

import { PageWithBreadcrumbsProps, PageWithHeadingAndBreadcrumb } from './PageBase'
import { Recipe, RecipeIngredient } from '../MainApp'
import EditRecipeForm from '../recipes/EditRecipeForm'

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

interface FindRecipeResult {
  recipe?: Recipe,
}

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

interface AddIngredientResult {
  recipeIngredient?: RecipeIngredient,
}

interface RemoveIngredientResult {
  id?: string,
}

interface RecipeEditorProps extends PageWithBreadcrumbsProps, RouteComponentProps {
  recipeId: string,
}

const RecipeEditorPage: FunctionComponent<RecipeEditorProps> = ({ history, breadcrumbs, recipeId }) => {
  const [recipe, setRecipe] = useState<Recipe | null>(null)

  const [addIngredientMutation] = useMutation<AddIngredientResult>(ADD_INGREDIENT)
  const [removeIngredientMutation] = useMutation<RemoveIngredientResult>(REMOVE_INGREDIENT)

  const recipeQuery = useQuery<FindRecipeResult>(FIND_RECIPE, {
    variables: {
      id: recipeId
    },
    skip: !recipeId
  })

  if (!recipeQuery.loading && recipeQuery.data && recipeQuery.data.recipe && !recipe) {
    setRecipe(recipeQuery.data.recipe)
  }

  const addIngredient = async (recipeId: string) => {
    try {
      const result = await addIngredientMutation({
        variables: {
          recipeId
        }
      })

      if (result.data && result.data.recipeIngredient) {
        return result.data.recipeIngredient
      }
    } catch (error) {
      console.log('error adding ingredient: ', error)
    }

    return null
  }

  const removeIngredient = async (recipeId: string, id: string) => {
    try {
      const result = await removeIngredientMutation({
        variables: {
          id,
          recipeId
        }
      })

      if (!(result.data && result.data.id)) {
        console.log('Could not remove ingredient')
      }
    } catch (error) {
      console.log('error removing ingredient: ', error)
    }
  }

  const title = (
    <span>
      Editing: {
        recipe
          ? recipe.name
          : <Loader style={{ marginLeft: '10px' }} active inline size='small' />
      }
    </span>
  )

  return (
    <PageWithHeadingAndBreadcrumb
      title={title}
      breadcrumbs={breadcrumbs}
    >
      {recipe
        ? <EditRecipeForm
          recipe={recipe}
          setRecipe={setRecipe}
          ingredientFactory={() => addIngredient(recipe.id)}
          onRemoveIngredient={(id) => removeIngredient(recipe.id, id)}
        />
        : <Loader active>Loading</Loader>}
    </PageWithHeadingAndBreadcrumb>
  )
}

export default withRouter(RecipeEditorPage)
