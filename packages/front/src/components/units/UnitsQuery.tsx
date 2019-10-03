import React, { FunctionComponent } from 'react'
import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import { OperationVariables } from 'apollo-client'
import { useQuery } from '@apollo/react-hooks'
import { QueryResult } from '@apollo/react-common'

import { Unit } from '../../types'

export const ALL_UNITS = gql`
{
  units: allUnits {
    id
    name
    abbreviation
  }
}
`

export interface UnitQueryData {
  units: Unit[],
}

interface RecipesQueryProps {
  query: DocumentNode,
  render: (units: QueryResult<UnitQueryData, OperationVariables>) => JSX.Element,
}

const UnitsQuery: FunctionComponent<RecipesQueryProps> = ({ query, render }) => {
  const units = useQuery<UnitQueryData, OperationVariables>(query)
  return (
    <>
      {render(units)}
    </>
  )
}

export default UnitsQuery
