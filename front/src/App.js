import React, { useState } from 'react'
import { gql } from 'apollo-boost';
import { Container } from 'semantic-ui-react';
import { useQuery, useMutation, useApolloClient } from 'react-apollo-hooks'

import { Route, Redirect, Switch, BrowserRouter as Router } from 'react-router-dom'

import Users from './components/Users'
import RegisterForm from './components/RegisterForm'
import LoginForm from './components/LoginForm'

const ALL_USERS = gql`
{
  allUsers {
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

  const allUsers = useQuery(ALL_USERS)
  const login = useMutation(LOGIN)
  const register = useMutation(REGISTER, {
    refetchQueries: [{ query: ALL_USERS }]
  })

  const [token, setToken] = useState(localStorage.getItem('menu-app-user-token'))
  const [currentUser, setCurrentUser] = useState(null)

  const logout = () => {
    localStorage.clear()
    client.resetStore()
    setToken(null)
  }

  return (
    <Container>
      <Router>
        <div>
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
            <Route exact path='/' render={() =>
              !token && <Redirect to='/login' />
            } />
          </Switch>

          <Route exact path='/' render={() =>
            <div>
              Hello world!<br />
              <button onClick={logout}>Log out</button>
            </div>
          } />
        </div>
      </Router>
    </Container>
  )
}

export default App;
