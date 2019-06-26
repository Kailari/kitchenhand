import React from 'react'
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'

import { useField } from '../../hooks/form'
import handleError from '../../util/error/authFormErrorHandler'

import FieldWithError from './FieldWithError'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'

interface RegisterFormProps extends RouteComponentProps {
  onRegister: (loginname: string, name: string, password: string) => void
}

const RegisterForm = ({ history, onRegister }: RegisterFormProps) => {
  const loginField = useField({ placeholder: 'Login Name', icon: 'user', className: 'loginname' })
  const nameField = useField({ placeholder: 'Display Name', icon: 'user', className: 'realname' })
  const passwordField = useField({ placeholder: 'Password', icon: 'lock', type: 'password', className: 'password' })

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await onRegister(loginField.value, nameField.value, passwordField.value)
      // TODO: Display "register succesfull, please, login" -message
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