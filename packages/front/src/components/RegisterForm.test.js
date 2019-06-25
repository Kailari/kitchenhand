import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import { MemoryRouter as Router } from 'react-router-dom'
import RegisterForm from './RegisterForm'

test('Form has loginname field', () => {
  const component = render(
    <Router>
      <RegisterForm registerUser={() => { }} />
    </Router>
  )

  const field = component.container.querySelector('.field.loginname input')
  expect(field).toHaveAttribute('placeholder', 'Login Name')
})

test('Form has display name field', () => {
  const component = render(
    <Router>
      <RegisterForm registerUser={() => { }} />
    </Router>
  )

  const field = component.container.querySelector('.field.realname input')
  expect(field).toHaveAttribute('placeholder', 'Display Name')
})

test('Form has password field', () => {
  const component = render(
    <Router>
      <RegisterForm registerUser={() => { }} />
    </Router>
  )

  const field = component.container.querySelector('.field.password input')
  expect(field).toHaveAttribute('placeholder', 'Password')
})

test('Form has link to /login', () => {
  const component = render(
    <Router>
      <RegisterForm registerUser={() => { }} />
    </Router>
  )

  const link = component.getByText('Log in')
  expect(link).toHaveAttribute('href', '/login')
})

test('Has Register button', () => {
  const component = render(
    <Router>
      <RegisterForm registerUser={() => { }} />
    </Router>
  )

  const button = component.container.querySelector('button[type=submit]')
  expect(button).toHaveTextContent('Register')
})

test('Pressing register triggers callback', () => {
  const mockLogin = jest.fn()
  const component = render(
    <Router>
      <RegisterForm registerUser={mockLogin} />
    </Router>
  )

  const button = component.container.querySelector('button[type=submit]')
  fireEvent.click(button)

  expect(mockLogin.mock.calls.length).toBe(1)
})
