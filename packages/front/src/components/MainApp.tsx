import React, { useEffect, useState } from 'react'
import { gql } from 'apollo-boost'
import { useQuery, useMutation, useApolloClient } from 'react-apollo-hooks'
import { Switch, Route } from 'react-router-dom'

import Dashboard from './Dashboard'
import ResponsiveContainer from './ResponsiveContainer'
import RecipeList from './recipes/RecipeList'
import AddRecipeForm from './recipes/AddRecipeForm'
import { NEW_RECIPES } from './recipes/RecipesQuery'
import DiscoverPage from './recipes/DiscoverPage'

const MY_RECIPES = gql`
{
  myRecipes {
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
  myRecipes: Recipe[]
}

const CREATE_RECIPE = gql`
mutation create($name: String!, $description: String!) {
  addRecipe(
    name: $name,
    description: $description
  ) {
    _id
    name
    description
    ingredients {
      _id
      ingredient {
        _id
        name
      }
      amount
      unit {
        _id
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
    _id
    name
  }
}
`

interface MainAppProps {
  token: string,
  onLogout: () => void,
}

export interface User {
  _id: string,
  name: string,
}

export interface Recipe {
  _id: string,
  name: string,
  description: string | null,
  owner: User | null,
}

const MainApp = ({ token, onLogout }: MainAppProps) => {
  const client = useApolloClient()

  const myRecipes = useQuery<RecipeQueryData>(MY_RECIPES)
  const me = useQuery(ME)

  const createRecipe = useMutation(CREATE_RECIPE, {
    refetchQueries: [
      { query: NEW_RECIPES },
      { query: MY_RECIPES },
    ]
  })

  const [currentUser, setCurrentUser] = useState<User | null>(null)

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
  return (
    <ResponsiveContainer logout={logout} currentUser={currentUser as User}>
      <Switch>
        <Route exact path='/' render={() =>
          <Dashboard />
        } />

        <Route exact path='/recipes/create' render={() =>
          <AddRecipeForm create={createRecipe} />
        } />

        <Route exact path='/recipes/discover' render={() =>
          <DiscoverPage breadcrumbs={[
            { name: 'Kitchenhand', path: '' },
            { name: 'Recipes', path: 'recipes' },
            { name: 'Discover', path: 'discover' },
          ]} />
        } />

        <Route exact path='/recipes/my' render={() =>
          !myRecipes.loading && myRecipes.data
            ? <RecipeList recipes={myRecipes.data.myRecipes} />
            : <div>Loading...</div>
        } />
      </Switch>
    </ResponsiveContainer>
  )
}

export default MainApp