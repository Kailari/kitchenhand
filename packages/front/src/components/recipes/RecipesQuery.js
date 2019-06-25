import React from 'react'
import { useQuery } from 'react-apollo-hooks';
import { gql } from 'apollo-boost'

export const TRENDING_RECIPES = gql`
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
}
`

export const NEW_RECIPES = gql`
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
}
`

export const RecipesQuery = ({ query, render }) => {
  const recipes = useQuery(query)
  return (
    <>
      {render(recipes)}
    </>
  )
}
