import React from 'react'
import { Link, withRouter } from 'react-router-dom'

import { useField } from '../hooks/form'
import handleError from '../util/error/authFormErrorHandler'

import FieldWithError from '../components/FieldWithError'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'

const RegisterForm = ({ history, registerUser }) => {
  const loginField = useField({ placeholder: 'Login Name', icon: 'user', className: 'loginname' })
  const nameField = useField({ placeholder: 'Display Name', icon: 'user', className: 'realname' })
  const passwordField = useField({ placeholder: 'Password', icon: 'lock', type: 'password', className: 'password' })

  const submit = async (e) => {
    e.preventDefault()

    try {
      await registerUser({
        variables: {
          loginname: loginField.value,
          name: nameField.value,
          password: passwordField.value
        }
      })

      history.push('/login')
    } catch (error) {
      passwordField.reset()
      loginField.setError(null)
      nameField.setError(null)
      passwordField.setError(null)
      handleError({
        setLoginnameError: loginField.setError,
        setNameError: nameField.setError,
        setPasswordError: passwordField.setError
      })(error)
    }
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
          Already an user? <Link to='/login'>Log in</Link>
        </Message>
      </Grid.Column>
    </Grid>
  )
}

export default withRouter(RegisterForm)