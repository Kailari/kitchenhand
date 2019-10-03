import React, { FunctionComponent } from 'react'
import gql from 'graphql-tag'
import { DocumentNode } from 'graphql'
import { OperationVariables } from 'apollo-client'
import { useQuery } from '@apollo/react-hooks'
import { QueryResult } from '@apollo/react-common'

import { Recipe } from '../../types'

export const TRENDING_RECIPES: DocumentNode = gql`
{
  recipes: allRecipes {
    id
    name
    description
    owner {
      id
      name
    }
  }
}`

export const NEW_RECIPES: DocumentNode = gql`
{
  recipes: allRecipes {
    id
    name
    description
    owner {
      id
      name
    }
  }
}`

export const MY_RECIPES = gql`
{
  recipes: myRecipes {
    id
    name
    description
    owner {
      id
      name
    }
  }
}`


export interface RecipeQueryData {
  recipes: Recipe[],
}

interface RecipesQueryProps {
  query: DocumentNode,
  render: (recipes: QueryResult<RecipeQueryData, OperationVariables>) => JSX.Element,
}

export const RecipesQuery: FunctionComponent<RecipesQueryProps> = ({ query, render }) => {
  const recipes = useQuery<RecipeQueryData, OperationVariables>(query)
  return (
    <>
      {render(recipes)}
    </>
  )
}
