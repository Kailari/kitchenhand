import React, { FunctionComponent } from 'react'
import { useMutation } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import { Loader, Header } from 'semantic-ui-react'

import { PageWithHeadingAndBreadcrumb, PageWithBreadcrumbsProps } from '../PageBase'
import CreateIngredientForm from '../../ingredients/CreateIngredientForm'
import EditIngredientsList from '../../ingredients/EditIngredientsList'
import { Unit, DirtyFlags, Ingredient } from '../../../types'
import IngredientsQuery, { ALL_INGREDIENTS, IngredientQueryData } from '../../ingredients/IngredientsQuery'

const CREATE_INGREDIENT = gql`
mutation create($name: String!, $defaultUnitId: ID) {
  added: addIngredient(
    name: $name,
    defaultUnitId: $defaultUnitId,
  ) {
    id
    name
    defaultUnit {
      id
      name
    }
  }
}`

interface CreateIngredientVariables {
  name: string,
  defaultUnitId?: string,
}

interface CreateIngredientResult {
  added: Ingredient,
}

const UPDATE_INGREDIENT = gql`
mutation update($id: ID!, $name: String, $defaultUnitId: ID) {
  updated: updateIngredient(
    id: $id,
    name: $name,
    defaultUnitId: $defaultUnitId,
  ) {
    id
    name
    defaultUnit {
      id
      name
    }
  }
}`

interface UpdateIngredientVariables {
  id: string,
  name?: string,
  defaultUnitId?: string | null,
}

interface UpdateIngredientResult {
  updated: Ingredient,
}

const REMOVE_INGREDIENT = gql`
mutation remove($id: ID!) {
  removed: removeIngredient(
    id: $id
  ) {
    id
  }
}`

interface RemoveIngredientVariables {
  id: string,
}

interface RemoveIngredientResult {
  removed: {
    id: string,
  },
}

type UnitsPageProps = PageWithBreadcrumbsProps

const IngredientsPage: FunctionComponent<UnitsPageProps> = ({ breadcrumbs }) => {
  const [createIngredientMutation] = useMutation<CreateIngredientResult, CreateIngredientVariables>(
    CREATE_INGREDIENT,
    {
      update: (store, response) => {
        const dataInStore = store.readQuery<IngredientQueryData>({ query: ALL_INGREDIENTS })
        if (dataInStore && response.data && response.data.added) {
          dataInStore.ingredients.push(response.data.added)
          store.writeQuery<IngredientQueryData>({
            query: ALL_INGREDIENTS,
            data: dataInStore,
          })
        }
      }
    }
  )

  const [updateIngredientMutation] = useMutation<UpdateIngredientResult, UpdateIngredientVariables>(
    UPDATE_INGREDIENT,
    {
      update: (store, response) => {
        const dataInStore = store.readQuery<IngredientQueryData>({ query: ALL_INGREDIENTS })
        if (dataInStore && response.data && response.data.updated) {
          const updated = response.data.updated
          dataInStore.ingredients.map((ingredient) => ingredient.id !== updated.id ? ingredient : updated)
          store.writeQuery<IngredientQueryData>({
            query: ALL_INGREDIENTS,
            data: dataInStore,
          })
        }
      }
    }
  )

  const [removeIngredientMutation] = useMutation<RemoveIngredientResult, RemoveIngredientVariables>(
    REMOVE_INGREDIENT,
    {
      update: (store, response) => {
        const dataInStore = store.readQuery<IngredientQueryData>({ query: ALL_INGREDIENTS })
        if (dataInStore && response.data && response.data.removed) {
          const removed = response.data.removed
          dataInStore.ingredients = dataInStore.ingredients.concat().filter((ingredient) => ingredient.id !== removed.id)
          store.writeQuery<IngredientQueryData>({
            query: ALL_INGREDIENTS,
            data: dataInStore,
          })
        }
      }
    }
  )

  const createIngredient = async (name: string, defaultUnit?: Unit) => {
    await createIngredientMutation({
      variables: {
        name,
        defaultUnitId: defaultUnit ? defaultUnit.id : undefined
      }
    })
  }

  const updateIngredient = async (ingredient: Ingredient, dirty: DirtyFlags<Ingredient>) => {
    await updateIngredientMutation({
      variables: {
        id: ingredient.id,
        name: dirty.name ? ingredient.name : undefined,
        defaultUnitId: (dirty.defaultUnit && ingredient.defaultUnit)
          ? ingredient.defaultUnit.id
          : undefined,
      }
    })
  }

  const removeIngredient = async (ingredient: Ingredient) => {
    await removeIngredientMutation({ variables: { id: ingredient.id } })
  }

  return (
    <PageWithHeadingAndBreadcrumb
      title='Manage ingredients'
      breadcrumbs={breadcrumbs}
    >
      <Header as='h3'>Create new ingredient</Header>
      <CreateIngredientForm onCreate={createIngredient} />
      <Header as='h3'>Ingredients</Header>
      <IngredientsQuery query={ALL_INGREDIENTS} render={(result) =>
        !result.loading && result.data
          ? <EditIngredientsList ingredients={result.data.ingredients} onUpdate={updateIngredient} onRemove={removeIngredient} />
          : <Loader active inline>Loading...</Loader>
      } />
    </PageWithHeadingAndBreadcrumb>
  )
}

export default IngredientsPage
