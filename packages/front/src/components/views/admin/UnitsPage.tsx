import React, { FunctionComponent } from 'react'
import { useMutation } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import { Loader, Header } from 'semantic-ui-react'

import { PageWithHeadingAndBreadcrumb, PageWithBreadcrumbsProps } from '../PageBase'
import EditUnitsList from '../../units/EditUnitsList'
import CreateUnitForm from '../../units/CreateUnitForm'
import UnitsQuery, { ALL_UNITS, UnitQueryData } from '../../units/UnitsQuery'
import { Unit } from '../../MainApp'

const CREATE_UNIT = gql`
mutation create($name: String!, $abbreviation: String!) {
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
  abbreviation: string,
}

interface CreateUnitResult {
  added: Unit,
}

type UnitsPageProps = PageWithBreadcrumbsProps

const UnitsPage: FunctionComponent<UnitsPageProps> = ({ breadcrumbs }) => {
  const [createUnitMutation] = useMutation<CreateUnitResult, CreateUnitVariables>(
    CREATE_UNIT,
    {
      update: (store, response) => {
        const dataInStore = store.readQuery<UnitQueryData>({ query: ALL_UNITS })
        if (dataInStore && response.data) {
          dataInStore.units.push(response.data.added)
          store.writeQuery<UnitQueryData>({
            query: ALL_UNITS,
            data: dataInStore,
          })
        }
      }
    }
  )

  const createUnit = async (name: string, abbreviation: string) => {
    await createUnitMutation({ variables: { name, abbreviation } })
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
          ? <EditUnitsList units={result.data.units} />
          : <Loader active inline>Loading...</Loader>
      } />
    </PageWithHeadingAndBreadcrumb>
  )
}

export default UnitsPage
