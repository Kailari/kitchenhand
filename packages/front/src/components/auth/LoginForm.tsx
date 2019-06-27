import React from 'react'
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'

import { useField } from '../../hooks/form'
import handleError from '../../util/error/authFormErrorHandler'

import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import FieldWithError from './FieldWithError'

interface LoginFormProps extends RouteComponentProps {
  onLogin: (loginname: string, password: string) => void,
}

const LoginForm = ({ history, onLogin }: LoginFormProps) => {
  const loginField = useField({ placeholder: 'Login Name', icon: 'user', className: 'loginname' })
  const passwordField = useField({ placeholder: 'Password', icon: 'lock', type: 'password', className: 'password' })

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await onLogin(loginField.value, passwordField.value)
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

            <Button color='teal' fluid size='large' type='submit'>
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
