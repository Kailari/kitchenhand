import React, { useState } from 'react'
import { gql } from 'apollo-boost';
import { Mutation } from 'react-apollo'
import { Container } from 'semantic-ui-react';
import { useQuery, useMutation, useApolloClient } from 'react-apollo-hooks'

import { Route, Redirect, BrowserRouter as Router } from 'react-router-dom'

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

  const [token, setToken] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <Container>
      <Router>
        <div>
          <Route exact path='/login' render={() =>
            <LoginForm
              login={login}
              setToken={token => setToken(token)}
            />
          } />
          <Route exact path='/register' render={() =>
            <RegisterForm registerUser={register}/>
          } />

          <Route exact path='/' render={() =>
            <div>
              Hello world!
            </div>
          } />

          <button onClick={logout}>Log out</button>
        </div>
      </Router>
    </Container>
  )
}

export default App;
