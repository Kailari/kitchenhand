import React, { useState } from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'

const RegisterForm = ({ registerUser }) => {
  const [name, setName] = useState('')
  const [loginname, setLoginname] = useState('')
  const [password, setPassword] = useState('')

  const [loginnameError, setLoginnameError] = useState(null)
  const [nameError, setNameError] = useState(null)

  const handleError = (error) => {
    console.log("eyyy lamo")
  }

  const submit = async (e) => {
    e.preventDefault()

    setNameError(null)
    setLoginnameError(null)

    try {
      await registerUser({
        onError: { handleError },
        variables: { loginname, name, password }
      })

      setName('')
      setLoginname('')
    } catch (error) {
      const invalidArgs = error.graphQLErrors[0].extensions.exception.invalidArgs
      if (invalidArgs.includes('loginname')) {
        if (error.message.includes('expected `loginname` to be unique')) {
          setLoginnameError('Name already taken')
        } else if (error.message.includes('Path `loginname` is required')) {
          setLoginnameError('Please enter a login name')
        } else {
          setLoginnameError('Name must be 5-32 characters long')
        }
      }

      if (invalidArgs.includes('name')) {
        if (error.message.includes('Path `name` is required')) {
          setNameError('A display name is required')
        } else {
          setNameError('Name must be 3-64 characters long')
        }
      }
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