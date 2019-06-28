import React, { FunctionComponent } from 'react'
import { useQuery, QueryHookResult } from 'react-apollo-hooks'
import { gql, DocumentNode, OperationVariables } from 'apollo-boost'
import { Recipe } from '../MainApp'

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
  render: (recipes: QueryHookResult<RecipeQueryData, OperationVariables>) => JSX.Element,
}

export const RecipesQuery: FunctionComponent<RecipesQueryProps> = ({ query, render }) => {
  const recipes = useQuery<RecipeQueryData, OperationVariables>(query)
  return (
    <>
      {render(recipes)}
    </>
  )
}
