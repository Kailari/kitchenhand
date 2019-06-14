import React, { useState } from 'react'
import { gql } from 'apollo-boost';
import { useQuery, useMutation, useApolloClient } from 'react-apollo-hooks'

import { Route, Redirect, Switch, BrowserRouter as Router } from 'react-router-dom'

import RegisterForm from './components/RegisterForm'
import LoginForm from './components/LoginForm'
import Dashboard from './components/Dashboard'
import ResponsiveContainer from './components/ResponsiveContainer'
import RecipeList from './components/recipes/RecipeList'

const ALL_RECIPES = gql`
{
  allRecipes {
    id
    name
  }
}
`

const LOGIN = gql`
mutation login($loginname: String!, $password: String!) {
  login(
    loginname: $loginname,
    password: $password,
  ) {
    value
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

const REGISTER = gql`
mutation register($loginname: String!, $name: String!, $password: String!) {
  registerUser(
    name: $name,
    loginname: $loginname,
    password: $password
  ) {
    id
    name
  }
}
`

const App = () => {
  const client = useApolloClient()

  const allRecipes = useQuery(ALL_RECIPES)
  const me = useMutation(ME)
  const login = useMutation(LOGIN)
  const register = useMutation(REGISTER/*, {
    refetchQueries: [{ query: ALL_USERS }]
  }*/)

  const [token, setToken] = useState(localStorage.getItem('menu-app-user-token'))
  const [currentUser, setCurrentUser] = useState(null)

  const logout = () => {
    localStorage.clear()
    client.resetStore()
    setToken(null)
  }

  if (token && !currentUser) {
    // TODO: Redirect to error-page
    me()
      .then(result => {
        const user = result.data.me
        if (!user) {
          console.log('Login failed')
          setToken(null)
          window.localStorage.clear()
        } else {
          setCurrentUser(result.data.me)
        }
      })
      .catch(error => {
        console.log('Error fetching user: ', error)
        setToken(null)
        window.localStorage.clear()
      })

    return (<div>
      Loading...
    </div>)
  }

  return (
    <Router>
      <Switch>
        <Route exact path='/login' render={() =>
          !token
            ? <LoginForm login={login} setToken={(token) => setToken(token)} />
            : <Redirect to='/' />
        } />
        <Route exact path='/register' render={() =>
          !token
            ? <RegisterForm registerUser={register} />
            : <Redirect to='/' />
        } />
        <Route path='/' render={() =>
          !token && <Redirect to='/login' />
        } />
      </Switch>

      {token && (
        <ResponsiveContainer logout={logout} currentUser={currentUser}>
          <Switch>
            <Route exact path='/' render={() =>
              <Dashboard />
            } />

            <Route exact path='/recipes/create' render={() =>
              <Dashboard />
            } />

            <Route exact path='/recipes/discover' render={() =>
              <RecipeList recipes={allRecipes.data.allRecipes}/>
            } />
          </Switch>
        </ResponsiveContainer>
      )}
    </Router>
  )
}

export default App;
