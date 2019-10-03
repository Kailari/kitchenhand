import React, { FunctionComponent } from 'react'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { Loader, Header } from 'semantic-ui-react'

import { PageWithHeadingAndBreadcrumb, PageWithBreadcrumbsProps } from '../PageBase'
import EditUnitsList from '../../units/EditUnitsList'
import CreateUnitForm from '../../units/CreateUnitForm'
import UnitsQuery, { ALL_UNITS, UnitQueryData } from '../../units/UnitsQuery'
import { Unit, Dirty, ID } from '../../../types'

const CREATE_UNIT = gql`
mutation create($name: String!, $abbreviation: String) {
  added: addUnit(
    name: $name,
    abbreviation: $abbreviation,
  ) {
    id
    name
    abbreviation
  }
}`

interface CreateUnitVariables {
  name: string,
  abbreviation?: string,
}

interface CreateUnitResult {
  added: Unit,
}

const UPDATE_UNIT = gql`
mutation update($id: ID!, $name: String, $abbreviation: String) {
  updated: updateUnit(
    id: $id,
    name: $name,
    abbreviation: $abbreviation,
  ) {
    id
    name
    abbreviation
  }
}`

interface UpdateUnitVariables {
  id: string,
  name?: string,
  abbreviation?: string | null,
}

interface UpdateUnitResult {
  updated: Unit,
}

const REMOVE_UNIT = gql`
mutation remove($id: ID!) {
  removed: removeUnit(
    id: $id
  ) {
    id
    name
    abbreviation
  }
}`

interface RemoveUnitVariables {
  id: string,
}

interface RemoveUnitResult {
  removed: Unit,
}

type UnitsPageProps = PageWithBreadcrumbsProps

const UnitsPage: FunctionComponent<UnitsPageProps> = ({ breadcrumbs }) => {
  const [createUnitMutation] = useMutation<CreateUnitResult, CreateUnitVariables>(
    CREATE_UNIT,
    {
      update: (store, response) => {
        const dataInStore = store.readQuery<UnitQueryData>({ query: ALL_UNITS })
        if (dataInStore && response.data && response.data.added) {
          dataInStore.units.push(response.data.added)
          store.writeQuery<UnitQueryData>({
            query: ALL_UNITS,
            data: dataInStore,
          })
        }
      }
    }
  )

  const [updateUnitMutation] = useMutation<UpdateUnitResult, UpdateUnitVariables>(
    UPDATE_UNIT,
    {
      update: (store, response) => {
        const dataInStore = store.readQuery<UnitQueryData>({ query: ALL_UNITS })
        if (dataInStore && response.data && response.data.updated) {
          const updated = response.data.updated
          dataInStore.units.map((unit) => unit.id !== updated.id ? unit : updated)
          store.writeQuery<UnitQueryData>({
            query: ALL_UNITS,
            data: dataInStore,
          })
        }
      }
    }
  )

  const [removeUnitMutation] = useMutation<RemoveUnitResult, RemoveUnitVariables>(
    REMOVE_UNIT,
    {
      update: (store, response) => {
        const dataInStore = store.readQuery<UnitQueryData>({ query: ALL_UNITS })
        if (dataInStore && response.data && response.data.removed) {
          const removed = response.data.removed
          dataInStore.units = dataInStore.units.concat().filter((unit) => unit.id !== removed.id)
          store.writeQuery<UnitQueryData>({
            query: ALL_UNITS,
            data: dataInStore,
          })
        }
      }
    }
  )

  const createUnit = async (name: string, abbreviation?: string) => {
    await createUnitMutation({ variables: { name, abbreviation } })
  }

  const updateUnit = async (id: ID, updated: Dirty<Unit>) => {
    await updateUnitMutation({
      variables: {
        id: id,
        name: updated.name || undefined,
        abbreviation: (updated.abbreviation && updated.abbreviation.length > 0) ? updated.abbreviation : null,
      }
    })
  }

  const removeUnit = async (id: ID) => {
    await removeUnitMutation({ variables: { id: id } })
  }

  return (
    <PageWithHeadingAndBreadcrumb
      title='Manage units'
      breadcrumbs={breadcrumbs}
    >
      <Header as='h3'>Create new unit</Header>
      <CreateUnitForm onCreate={createUnit} />
      <Header as='h3'>Units</Header>
      <UnitsQuery query={ALL_UNITS} render={(result) =>
        !result.loading && result.data
          ? <EditUnitsList
            units={result.data.units}
            onUpdate={updateUnit}
            onRemove={removeUnit} />
          : <Loader active inline>Loading...</Loader>
      } />
    </PageWithHeadingAndBreadcrumb>
  )
}

export default UnitsPage
