import React from 'react'
import { withRouter } from 'react-router-dom'

import { useField } from '../hooks/form'
import handleError from '../util/error/authFormErrorHandler'

import FieldWithError from '../components/FieldWithError'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'

const RegisterForm = ({ history, registerUser }) => {
  const loginField = useField({ placeholder: 'Login Name', icon: 'user' })
  const nameField = useField({ placeholder: 'Display name', icon: 'user' })
  const passwordField = useField({ placeholder: 'Password', icon: 'lock', type: 'password' })

  const submit = async (e) => {
    e.preventDefault()

    loginField.setError(null)
    nameField.setError(null)
    passwordField.setError(null)

    try {
      await registerUser({
        variables: {
          loginname: loginField.value,
          name: nameField.value,
          password: passwordField.value
        }
      })

      loginField.reset()
      nameField.reset()

      history.push('/login')
    } catch (error) {
      handleError({
        setLoginnameError: loginField.setError,
        setNameError: nameField.setError,
        setPasswordError: passwordField.setError
      })(error)
    }

    passwordField.reset()
  }

  return (
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='teal' textAlign='center'>
          <Image src='/logo.png' /> Create a new account
        </Header>
        <Form size='large' onSubmit={submit}>
          <Segment stacked>
            <FieldWithError field={loginField} />
            <FieldWithError field={nameField} />
            <FieldWithError field={passwordField} />

            <Button color='teal' fluid size='large' type='submit'>
              Register
            </Button>
          </Segment>
        </Form>
        <Message>
          Already an user? <a href='/login'>Log in</a>
        </Message>
      </Grid.Column>
    </Grid>
  )
}

export default withRouter(RegisterForm)