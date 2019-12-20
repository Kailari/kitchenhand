import React, { FunctionComponent } from 'react'
import gql from 'graphql-tag'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Loader } from 'semantic-ui-react'

import { PageWithBreadcrumbsProps, PageWithHeadingAndBreadcrumb } from './PageBase'
import { Recipe, RecipeIngredient, Unit, Ingredient, ID, Dirty } from '../../types'
import EditRecipeForm from '../recipes/EditRecipeForm'

const FIND_RECIPE = gql`
query find($id: ID!) {
  recipe(id: $id) {
    id
    name
    description
    ingredients {
      id
      index
      amount
      unit {
        id
        name
        abbreviation
      }
      ingredient {
        id
        name
      }
    }
  }
}`

interface FindRecipeResult {
  recipe?: Recipe,
}


const UPDATE_RECIPE_NAME = gql`
mutation updateRecipeName($id: ID!, $name: String) {
  updated: updateRecipe(id: $id, name: $name) {
    name
  }
}`

interface UpdateRecipeNameVariables {
  id: string,
  name: string,
}

interface UpdateRecipeNameResult {
  updated: {
    id: string,
    name: string,
  },
}


const UPDATE_RECIPE_SUMMARY = gql`
mutation updateRecipeSummary($id: ID!, $summary: String) {
  updated: updateRecipe(id: $id, description: $summary) {
    description
  }
}`

interface UpdateRecipeSummaryVariables {
  id: string,
  summary: string,
}

interface UpdateRecipeSummaryResult {
  updated: {
    id: string,
    description: string,
  },
}


const UPDATE_INGREDIENT = gql`
mutation updateIngredient(
  $recipeId: ID!
  $recipeIngredientId: ID!
  $amount: Float
  $ingredientId: ID
  $unitId: ID
  $index: Int
){
  updated: updateRecipeIngredient(
    id: $recipeIngredientId
    recipeId: $recipeId
    amount: $amount
    ingredientId: $ingredientId
    unitId: $unitId
    index: $index
  ) {
    id
    index
    amount
    ingredient {
      id
      name
      defaultUnit {
        id
        name
        abbreviation
      }
    }
    unit {
      id
      name
      abbreviation
    }
  }
}`


interface UpdateIngredientVariables {
  recipeId: string,
  recipeIngredientId: string,
  index?: number,
  amount?: number,
  ingredientId?: ID,
  unitId?: ID,
}

interface UpdateIngredientResult {
  updated: {
    id: string,
    index: number,
    amount: number,
    ingredient: Ingredient,
    unit: Unit,
  },
}

const ADD_INGREDIENT = gql`
mutation addIngredient($recipeId: ID!) {
  added: addRecipeIngredient(recipeId: $recipeId) {
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

interface AddIngredientVariables {
  recipeId: ID,
  index: number,
  amount: number,
  ingredientId: ID,
  unitId: ID,
}

interface AddIngredientResult {
  added?: RecipeIngredient,
}


const REMOVE_INGREDIENT = gql`
mutation removeIngredient(
  $recipeIngredientId: ID!
  $recipeId: ID!
) {
  id: removeRecipeIngredient(
    recipeId: $recipeId
    id: $recipeIngredientId
  )
}`

interface RemoveIngredientVariables {
  recipeIngredientId: ID,
  recipeId: ID,
}

interface RemoveIngredientResult {
  id?: string,
}


interface RecipeEditorProps extends PageWithBreadcrumbsProps, RouteComponentProps {
  recipeId: string,
}

const RecipeEditorPage: FunctionComponent<RecipeEditorProps> = ({ breadcrumbs, recipeId }) => {
  const recipeQuery = { query: FIND_RECIPE, variables: { id: recipeId } }

  const [updateRecipeNameMutation] = useMutation<UpdateRecipeNameResult, UpdateRecipeNameVariables>(
    UPDATE_RECIPE_NAME,
    {
      update: (store, response) => {
        const variables = { id: recipeId }
        const dataInStore = store.readQuery<FindRecipeResult>({ query: FIND_RECIPE, variables })
        if (dataInStore && dataInStore.recipe && response.data) {
          dataInStore.recipe.name = response.data.updated.name
          store.writeQuery<FindRecipeResult>({
            query: FIND_RECIPE,
            variables,
            data: dataInStore,
          })
        }
      }
    })
  const [updateRecipeSummaryMutation] = useMutation<UpdateRecipeSummaryResult, UpdateRecipeSummaryVariables>(
    UPDATE_RECIPE_SUMMARY,
    {
      update: (store, response) => {
        const variables = { id: recipeId }
        const dataInStore = store.readQuery<FindRecipeResult>({ query: FIND_RECIPE, variables })
        if (dataInStore && dataInStore.recipe && response.data) {
          dataInStore.recipe.description = response.data.updated.description
          store.writeQuery<FindRecipeResult>({
            query: FIND_RECIPE,
            variables,
            data: dataInStore,
          })
        }
      }
    })

  const [addIngredientMutation] = useMutation<AddIngredientResult, AddIngredientVariables>(
    ADD_INGREDIENT,
    {
      update: (store, response) => {
        const dataInStore = store.readQuery<FindRecipeResult>(recipeQuery)
        if (dataInStore && dataInStore.recipe && response.data && response.data.added) {
          const added = response.data.added
          dataInStore.recipe.ingredients.push(added)
          store.writeQuery<FindRecipeResult>({
            ...recipeQuery,
            data: dataInStore,
          })
        }
      }
    })
  const [removeIngredientMutation] = useMutation<RemoveIngredientResult, RemoveIngredientVariables>(
    REMOVE_INGREDIENT,
    {
      update: (store, response) => {
        const dataInStore = store.readQuery<FindRecipeResult>(recipeQuery)
        if (dataInStore && dataInStore.recipe && response.data && response.data.id) {
          const removedId = response.data.id
          dataInStore.recipe.ingredients = dataInStore.recipe.ingredients.filter((i) => i.id !== removedId)
          store.writeQuery<FindRecipeResult>({
            ...recipeQuery,
            data: dataInStore,
          })
        }
      }
    })

  const [updateIngredientMutation] = useMutation<UpdateIngredientResult, UpdateIngredientVariables>(
    UPDATE_INGREDIENT,
    {
      update: (store, response) => {
        const dataInStore = store.readQuery<FindRecipeResult>(recipeQuery)
        if (dataInStore && dataInStore.recipe && response.data && response.data.updated) {
          const updated = response.data.updated
          console.log('updated:', updated)
          const newIngredients = dataInStore.recipe.ingredients.map(
            (i) => i.id === updated.id
              ? updated
              : i)
          dataInStore.recipe.ingredients = newIngredients
          store.writeQuery<FindRecipeResult>({
            ...recipeQuery,
            data: dataInStore,
          })
        }
      }
    })

  // TODO: Use query component to wrap the recipe state and query away from the editor
  const recipeQueryState = useQuery<FindRecipeResult>(recipeQuery.query, {
    variables: recipeQuery.variables,
    skip: !recipeId
  })

  const handleUpdateName = async (name: string) => {
    await updateRecipeNameMutation({ variables: { id: recipeId, name: name } })
  }

  const handleUpdateSummary = async (summary: string) => {
    await updateRecipeSummaryMutation({ variables: { id: recipeId, summary: summary } })
  }

  const handleCreateIngredient = async (index: number, amount: number, ingredient: Ingredient, unit: Unit) => {
    const response = await addIngredientMutation({
      variables: {
        recipeId: recipeId,
        index: index,
        amount: amount,
        ingredientId: ingredient.id,
        unitId: unit.id,
      }
    })

    if (response && response.data && response.data.added) {
      const added = response.data.added
      return added
    }

    throw new Error('something went wrong')
  }

  const handleRemoveIngredient = async (recipeIngredientId: string) => {
    await removeIngredientMutation({
      variables: {
        recipeIngredientId: recipeIngredientId,
        recipeId: recipeId
      }
    })
  }

  const handleUpdateIngredient = async (id: ID, updated: Dirty<RecipeIngredient>) => {
    await updateIngredientMutation({
      variables: {
        recipeId: recipeId,
        recipeIngredientId: id,
        ...updated,
      }
    })
  }

  return (
    <PageWithHeadingAndBreadcrumb
      title='Editing Recipe'
      breadcrumbs={breadcrumbs}
    >
      {!recipeQueryState.loading && recipeQueryState.data && recipeQueryState.data.recipe
        ? <EditRecipeForm
          recipe={recipeQueryState.data.recipe}
          onUpdateName={handleUpdateName}
          onUpdateSummary={handleUpdateSummary}
          onCreateIngredient={handleCreateIngredient}
          onRemoveIngredient={handleRemoveIngredient}
          onUpdateIngredient={handleUpdateIngredient}
        />
        : <Loader active>Loading</Loader>}
    </PageWithHeadingAndBreadcrumb>
  )
}

export default withRouter(RecipeEditorPage)
