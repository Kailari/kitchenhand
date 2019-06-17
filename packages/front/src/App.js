import React, { useState } from 'react'
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

  const loginMutation = useMutation(LOGIN, {
    update: (proxy, mutationResult) => {
      client.resetStore()
    }
  })
  const register = useMutation(REGISTER)

  const [token, setToken] = useState(localStorage.getItem('menu-app-user-token'))

  const logout = () => {
    localStorage.clear()
    setToken(null)
  }

  const login = async (loginname, password) => {
    const result = await loginMutation({
      variables: { loginname, password }
    })

    const resultToken = result.data.login.value
    localStorage.setItem('menu-app-user-token', resultToken)
    setToken(resultToken)
  }


  console.log('Rendering@App')
  return (
    <Router>
      {!token &&
        <Switch>
          <Route exact path='/register' render={() =>
            <RegisterForm registerUser={register} />
          } />
          <Route exact path='/login' render={() =>
            <LoginForm onLogin={login} />
          } />
          <Route path='/' render={() => <Redirect to='/login' />} />
        </Switch>
      }

      {token && (
        <MainApp token={token} onLogout={logout} />
      )}
    </Router>
  )
}

export default App;
