import React from 'react'
import { Link, withRouter } from "react-router-dom";

import { useField } from '../hooks/form'
import handleError from '../util/error/authFormErrorHandler'

import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import FieldWithError from '../components/FieldWithError'

const LoginForm = ({ history, login, setToken }) => {
  const loginField = useField({ placeholder: 'Login Name', icon: 'user' })
  const passwordField = useField({ placeholder: 'Password', icon: 'lock', type: 'password' })

  const submit = async (e) => {
    e.preventDefault()

    try {
      const result = await login({
        variables: {
          loginname: loginField.value,
          password: passwordField.value
        }
      })

      const token = result.data.login.value
      localStorage.setItem('menu-app-user-token', token)

      setToken(token)
      history.push('/')
    } catch (error) {
      loginField.setError(null)
      passwordField.setError(null)
      handleError({
        setLoginnameError: loginField.setError,
        setPasswordError: passwordField.setError,
        setNameError: null,
      })(error)
    }
  }

  return (
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='teal' textAlign='center'>
          <Image src='/logo.png' /> Welcome, please log in!
        </Header>
        <Form size='large' onSubmit={submit}>
          <Segment stacked>
            <FieldWithError field={loginField} />
            <FieldWithError field={passwordField} />

            <Button color='teal' fluid size='large' type='submit' style={{ cursor: 'pointer' }}>
              Login
            </Button>
          </Segment>
        </Form>
        <Message>
          New to us? <Link to='/register'>Sign up</Link>
        </Message>
      </Grid.Column>
    </Grid>
  )
}

export default withRouter(LoginForm)