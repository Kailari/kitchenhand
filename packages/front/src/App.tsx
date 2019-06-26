import React, { useState } from 'react'
import { gql } from 'apollo-boost'
import { useMutation, useApolloClient } from 'react-apollo-hooks'

import { Redirect, Route, Switch, BrowserRouter as Router } from 'react-router-dom'

import RegisterForm from './components/auth/RegisterForm'
import LoginForm from './components/auth/LoginForm'
import MainApp from './components/MainApp'

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

interface LoginResult {
  login: {
    value: string
  }
}

const REGISTER = gql`
mutation register($loginname: String!, $name: String!, $password: String!) {
  registerUser(
    name: $name,
    loginname: $loginname,
    password: $password
  ) {
    _id
    name
  }
}`

interface RegisterResult {
  id: string,
  name: string
}


const App = () => {
  const client = useApolloClient()

  const loginMutation = useMutation<LoginResult>(LOGIN, {
    update: (proxy, mutationResult) => {
      client.resetStore()
    }
  })
  const registerMutation = useMutation<RegisterResult>(REGISTER)

  const [token, setToken] = useState(localStorage.getItem('menu-app-user-token'))

  const logout = () => {
    localStorage.clear()
    setToken(null)
  }

  const login = async (loginname: string, password: string) => {
    const result = await loginMutation({
      variables: { loginname, password }
    })

    if (!result.data) {
      // TODO: Redirect to 'oops'-page
      console.log('login failed')
      return
    }

    const resultToken = result.data.login.value
    localStorage.setItem('menu-app-user-token', resultToken)
    setToken(resultToken)
  }

  const register = async (loginname: string, name: string, password: string) => {
    const result = await registerMutation({
      variables: {
        loginname,
        name,
        password
      }
    })


  }


  console.log('Rendering@App')
  return (
    <Router>
      {!token &&
        <Switch>
          <Route exact path='/register' render={() =>
            <RegisterForm onRegister={register} />
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
