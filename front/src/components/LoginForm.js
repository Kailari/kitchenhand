import React, { useState } from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'

const LoginForm = ({ login, setToken }) => {
  const [loginname, setLoginname] = useState('')
  const [password, setPassword] = useState('')

  const submit = async (e) => {
    e.preventDefault()

    try {
      const result = await login({
        variables: { loginname, password }
      })

      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('menu-app-user-token', token)

      setLoginname('')
    } catch (error) {
      console.log(error)
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
            <Form.Input fluid icon='user' iconPosition='left' placeholder='Login name' />
            <Form.Input
              fluid 
              icon='lock' 
              iconPosition='left'
              type='password'
              placeholder='Password'
            />

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

export default LoginForm