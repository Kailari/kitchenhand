import React, { useEffect, useState } from 'react'
import { gql } from 'apollo-boost'
import { useQuery, useApolloClient } from 'react-apollo-hooks'
import { Switch, Route } from 'react-router-dom'

import Dashboard from './views/Dashboard'
import ResponsiveContainer from './ResponsiveContainer'
import RecipeList from './recipes/RecipeList'
import RecipeEditor from './views/RecipeEditor'
import Discover from './views/DiscoverPage'
import { MY_RECIPES, RecipeQueryData } from './recipes/RecipesQuery'

const ME = gql`
{
  me {
    id
    name
  }
}
`

interface MainAppProps {
  token: string,
  onLogout: () => void,
}

export interface User {
  id: string,
  name: string,
}


export interface RecipeIngredient {
  id: string,
  amount: number,
  ingredient: {
    id: string,
    name: string,
  },
  unit: {
    id: string,
    name: string,
    abbreviation: string,
  },
}

export interface Recipe {
  id: string,
  name: string,
  views: number,
  category?: string,
  date?: Date,
  description?: string,
  owner?: User,
  ingredients?: RecipeIngredient[],
}

const MainApp = ({ token, onLogout }: MainAppProps) => {
  const client = useApolloClient()

  const myRecipes = useQuery<RecipeQueryData>(MY_RECIPES)
  const me = useQuery(ME)

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

        <Route exact path='/recipes/:id/edit' render={({ match }) =>
          <RecipeEditor
            recipeId={match.params.id}
            breadcrumbs={[
              { name: 'Kitchenhand', path: '' },
              { name: 'Recipes', path: 'recipes' },
              { name: 'Recipe', path: match.params.id },
              { name: 'Edit', path: 'edit' },
            ]}
          />
        } />

        <Route exact path='/recipes/create' render={() =>
          <RecipeEditor breadcrumbs={[
            { name: 'Kitchenhand', path: '' },
            { name: 'Recipes', path: 'recipes' },
            { name: 'Create', path: 'create' },
          ]} />
        } />

        <Route exact path='/recipes/discover' render={() =>
          <Discover breadcrumbs={[
            { name: 'Kitchenhand', path: '' },
            { name: 'Recipes', path: 'recipes' },
            { name: 'Discover', path: 'discover' },
          ]} />
        } />

        <Route exact path='/recipes/my' render={() =>
          !myRecipes.loading && myRecipes.data
            ? <RecipeList recipes={myRecipes.data.recipes} />
            : <div>Loading...</div>
        } />
      </Switch>
    </ResponsiveContainer>
  )
}

export default MainApp
