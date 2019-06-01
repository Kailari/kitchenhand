import React, { useState } from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'

import handleError from '../util/error/authFormErrorHandler'

const RegisterForm = ({ registerUser }) => {
  const [name, setName] = useState('')
  const [loginname, setLoginname] = useState('')
  const [password, setPassword] = useState('')

  const [loginnameError, setLoginnameError] = useState(null)
  const [nameError, setNameError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)

  const submit = async (e) => {
    e.preventDefault()

    setNameError(null)
    setLoginnameError(null)
    setPasswordError(null)

    try {
      await registerUser({
        variables: { loginname, name, password }
      })

      setName('')
      setLoginname('')
    } catch (error) {
      handleError({
        setLoginnameError, 
        setNameError,
        setPasswordError
      })(error)
    }

    setPassword('')
  }

  return (
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='teal' textAlign='center'>
          <Image src='/logo.png' /> Create a new account
        </Header>
        <Form size='large' onSubmit={submit}>
          <Segment stacked>
            <Form.Input
              fluid
              icon='user'
              iconPosition='left'
              placeholder='Login name'
              value={loginname}
              onChange={(e, { value }) => setLoginname(value)}
            />
            {loginnameError && (
              <Message>
                {loginnameError}
              </Message>
            )}
            <Form.Input
              fluid
              icon='user'
              iconPosition='left'
              placeholder='Display name'
              value={name}
              onChange={(e, { value }) => setName(value)}
            />
            {nameError && (
              <Message>
                {nameError}
              </Message>
            )}
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

export default RegisterForm