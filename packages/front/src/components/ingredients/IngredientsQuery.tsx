import React, { FunctionComponent } from 'react'
import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import { OperationVariables } from 'apollo-client'
import { useQuery } from '@apollo/react-hooks'
import { QueryResult } from '@apollo/react-common'

import { Ingredient } from '../../types'

export const ALL_INGREDIENTS = gql`
{
  ingredients: allIngredients {
    id
    name
    defaultUnit {
      id
      name
      abbreviation
    }
  }
}`

export interface IngredientQueryData {
  ingredients: Ingredient[],
}

interface IngredientsQueryProps {
  query: DocumentNode,
  render: (ingredients: QueryResult<IngredientQueryData, OperationVariables>) => JSX.Element,
}

const IngredientsQuery: FunctionComponent<IngredientsQueryProps> = ({ query, render }) => {
  const ingredients = useQuery<IngredientQueryData, OperationVariables>(query)
  return (
    <>
      {render(ingredients)}
    </>
  )
}

export default IngredientsQuery
