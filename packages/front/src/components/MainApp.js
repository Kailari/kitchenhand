import React, { useEffect, useState } from 'react'
import { gql } from 'apollo-boost'
import { useQuery, useMutation, useApolloClient } from 'react-apollo-hooks'
import { Switch, Route } from 'react-router-dom'

import Dashboard from './Dashboard'
import ResponsiveContainer from './ResponsiveContainer'
import RecipeList from './recipes/RecipeList'
import AddRecipeForm from './recipes/AddRecipeForm'

const ALL_RECIPES = gql`
{
  allRecipes {
    id
    name
    description
    owner {
      id
      name
    }
  }
}
`

const MY_RECIPES = gql`
{
  myRecipes {
    id
    name
    description
    owner {
      id
      name
    }
  }
}
`

const CREATE_RECIPE = gql`
mutation create($name: String!, $description: String!) {
  addRecipe(
    name: $name,
    description: $description
  ) {
    id
    name
    description
    ingredients {
      id
      ingredient {
        id
        name
      }
      amount
      unit {
        id
        name
        abbreviation
      }
    }
  }
}
`

const ME = gql`
{
  me {
    id
    name
  }
}
`

const MainApp = ({ token, onLogout }) => {
  const client = useApolloClient()

  const allRecipes = useQuery(ALL_RECIPES)
  const myRecipes = useQuery(MY_RECIPES)
  const me = useQuery(ME)

  const createRecipe = useMutation(CREATE_RECIPE, {
    refetchQueries: [
      { query: ALL_RECIPES },
      { query: MY_RECIPES },
    ]
  })

  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    if (!me.loading && me.data.me !== null) {
      setCurrentUser(me.data.me)
    }
  }, [me.loading, me.data.me])

  const logout = () => {
    console.log('logging out')
    localStorage.clear()
    client.clearStore()
    setCurrentUser(null)
    onLogout()
  }

  if (token && !currentUser) {
    console.log('Loading@MainApp')
    return (<div>
      Loading...
    </div>)
  }
  
  console.log('Rendering@MainApp')
  // TODO: Move handling query.loading to components instead of doing it here to avoid having to re-render everything
  return (
    <ResponsiveContainer logout={logout} currentUser={currentUser}>
      <Switch>
        <Route exact path='/' render={() =>
          <Dashboard />
        } />

        <Route exact path='/recipes/create' render={() =>
          <AddRecipeForm create={createRecipe} />
        } />

        <Route exact path='/recipes/discover' render={() =>
          !allRecipes.loading
            ? <RecipeList recipes={allRecipes.data.allRecipes} title='List of all recipes:' />
            : <div>Loading...</div>
        } />

        <Route exact path='/recipes/my' render={() =>
          !myRecipes.loading
            ? <RecipeList recipes={myRecipes.data.myRecipes} title='List of my recipes:' />
            : <div>Loading...</div>
        } />
      </Switch>
    </ResponsiveContainer>
  )
}

export default MainApp