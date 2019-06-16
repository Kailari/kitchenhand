import React, { useState, useEffect } from 'react'
import { gql } from 'apollo-boost'
import { useMutation, useApolloClient } from 'react-apollo-hooks'

import { Redirect, Route, Switch, BrowserRouter as Router } from 'react-router-dom'

import RegisterForm from './components/RegisterForm'
import LoginForm from './components/LoginForm'
import MainApp from './components/MainApp';

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

  const login = useMutation(LOGIN, {
    update: (proxy, mutationResult) => {
      client.resetStore()
    }
  })
  const register = useMutation(REGISTER)

  const [token, setToken] = useState(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('menu-app-user-token')
    if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  console.log('Rendering@App')
  return (
    <Router>
      {!token &&
        <Switch>
          <Route exact path='/register' render={() =>
            <RegisterForm registerUser={register} />
          } />
          <Route exact path='/login' render={() =>
            <LoginForm login={login} setToken={(token) => setToken(token)} />
          } />
          <Route path='/' render={() => <Redirect to='/login' />} />
        </Switch>
      }

      {token && (
        <MainApp token={token} setToken={setToken} />
      )}
    </Router>
  )
}

export default App;
