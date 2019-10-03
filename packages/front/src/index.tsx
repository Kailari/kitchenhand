import React from 'react'
import ReactDOM from 'react-dom'

import ApolloClient from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks'

import App from './App'

const httpLink = createHttpLink({
  uri: '/graphql',
  credentials: 'same-origin'
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('menu-app-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null,
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

// TODO: If connection fails, render "service temporarily unavailable" splash

ReactDOM.render(
  <ApolloHooksProvider client={client}>
    <App />
  </ApolloHooksProvider>,
  document.getElementById('root')
)
