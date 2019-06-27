import React, { FunctionComponent } from 'react'
import { useQuery, QueryHookResult } from 'react-apollo-hooks'
import { gql, DocumentNode, OperationVariables } from 'apollo-boost'
import { Recipe } from '../MainApp'

export const TRENDING_RECIPES: DocumentNode = gql`
{
  allRecipes {
    _id
    name
    description
    owner {
      _id
      name
    }
  }
}`

export const NEW_RECIPES: DocumentNode = gql`
{
  allRecipes {
    _id
    name
    description
    owner {
      _id
      name
    }
  }
}`


interface RecipeQueryData {
  allRecipes: Recipe[]
}

interface RecipesQueryProps {
  query: DocumentNode,
  render: (recipes: QueryHookResult<RecipeQueryData, OperationVariables>) => JSX.Element
}

export const RecipesQuery: FunctionComponent<RecipesQueryProps> = ({ query, render }) => {
  const recipes = useQuery<RecipeQueryData, OperationVariables>(query)
  return (
    <>
      {render(recipes)}
    </>
  )
}
