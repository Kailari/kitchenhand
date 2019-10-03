import React, { useEffect, useState } from 'react'
import gql from 'graphql-tag'
import { Switch, Route } from 'react-router-dom'
import { useQuery, useApolloClient } from '@apollo/react-hooks'

import Dashboard from './views/Dashboard'
import RecipeEditorPage from './views/RecipeEditorPage'
import CreateRecipePage from './views/CreateRecipePage'
import ResponsiveContainer from './ResponsiveContainer'
import Discover from './views/DiscoverPage'
import UnitsPage from './views/admin/UnitsPage'
import { User } from '../types'
import IngredientsPage from './views/admin/IngredientsPage'
import CookbookPage from './views/CookbookPage'

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

const MainApp = ({ token, onLogout }: MainAppProps) => {
  const client = useApolloClient()
  const me = useQuery(ME)

  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    if (!me.loading && me.data.me !== null) {
      setCurrentUser(me.data.me)
    }
  }, [me.loading, me.data])

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
          <RecipeEditorPage
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
          <CreateRecipePage breadcrumbs={[
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
          <CookbookPage breadcrumbs={[
            { name: 'Kitchenhand', path: '' },
            { name: 'Recipes', path: 'recipes' },
            { name: 'Cookbook', path: 'cookbook' },
          ]} />
        } />

        <Route exact path='/admin/units' render={() =>
          <UnitsPage breadcrumbs={[
            { name: 'Kitchenhand', path: '' },
            { name: 'Admin', path: 'admin' },
            { name: 'Units', path: 'units' },
          ]} />
        } />

        <Route exact path='/admin/ingredients' render={() =>
          <IngredientsPage breadcrumbs={[
            { name: 'Kitchenhand', path: '' },
            { name: 'Admin', path: 'admin' },
            { name: 'Ingredients', path: 'ingredients' },
          ]} />
        } />
      </Switch>
    </ResponsiveContainer>
  )
}

export default MainApp
