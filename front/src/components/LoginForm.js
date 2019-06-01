import React, { useState } from 'react'
import { withRouter } from "react-router-dom";
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'

import { useField } from '../hooks/form'
import handleError from '../util/error/authFormErrorHandler'

const FieldWithError = ({ field }) => {
  return (
    <>
      <Form.Input
        fluid
        iconPosition='left'
        {...field.elementArgs}
      />
      {field.error && (
        <Message>
          {field.error}
        </Message>
      )}
    </>
  )
}

const LoginForm = ({ history, login, setToken }) => {
  const [loginname, setLoginname] = useState('')
  const [password, setPassword] = useState('')

  const [loginnameError, setLoginnameError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)

  const loginField = useField({ placeholder: 'Login Name', icon: 'user' })

  const submit = (e) => {
    e.preventDefault()

    login({
      variables: {
        loginname: loginField.value,
        password: password
      }
    }).then((result) => {
      const token = result.data.login.value
      localStorage.setItem('menu-app-user-token', token)

      setToken(token)
      history.push('/')
    }).catch((error) => {
      loginField.setError(null)
      setPasswordError(null)
      handleError({
        setLoginnameError: loginField.setError,
        setNameError: null,
        setPasswordError: setPasswordError,
      })(error)
    })
  }

  return (
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='teal' textAlign='center'>
          <Image src='/logo.png' /> Welcome, please login!
        </Header>
        <Form size='large' onSubmit={submit}>
          <Segment stacked>
            <FieldWithError field={loginField} />
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e, { value }) => setPassword(value)}
            />
            {passwordError && (
              <Message>
                {passwordError}
              </Message>
            )}

            <Button color='teal' fluid size='large' type='submit'>
              Login
            </Button>
          </Segment>
        </Form>
        <Message>
          New to us? <a href='/register'>Sign up</a>
        </Message>
      </Grid.Column>
    </Grid>
  )
}

export default withRouter(LoginForm)