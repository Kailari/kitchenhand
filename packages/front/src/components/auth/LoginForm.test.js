import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import { MemoryRouter as Router } from 'react-router-dom'
import LoginForm from './LoginForm'

test('Form has loginname field', () => {
  const component = render(
    <Router>
      <LoginForm onLogin={() => { }} />
    </Router>
  )

  const field = component.container.querySelector('.field.loginname input')
  expect(field).toHaveAttribute('placeholder', 'Login Name')
})

test('Form has password field', () => {
  const component = render(
    <Router>
      <LoginForm onLogin={() => { }} />
    </Router>
  )

  const field = component.container.querySelector('.field.password input')
  expect(field).toHaveAttribute('placeholder', 'Password')
})

test('Form has link to /register', () => {
  const component = render(
    <Router>
      <LoginForm onLogin={() => { }} />
    </Router>
  )

  const link = component.getByText('Sign up')
  expect(link).toHaveAttribute('href', '/register')
})

test('Has Login button', () => {
  const component = render(
    <Router>
      <LoginForm onLogin={() => { }} />
    </Router>
  )

  const button = component.container.querySelector('button[type=submit]')
  expect(button).toHaveTextContent('Login')
})

test('Pressing login triggers callback', () => {
  const mockLogin = jest.fn()
  const component = render(
    <Router>
      <LoginForm onLogin={mockLogin} />
    </Router>
  )

  const button = component.container.querySelector('button[type=submit]')
  fireEvent.click(button)

  expect(mockLogin.mock.calls.length).toBe(1)
})
