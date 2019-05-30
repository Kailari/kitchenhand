import React from 'react'
import { ApolloConsumer, Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import Users from './components/Users'

const ALL_USERS = gql`
{
  allUsers {
    id
    name
  }
}
`

const App = () => {
  return (
    <div>
      <ApolloConsumer>
        {(client =>
          <Query query={ALL_USERS}>
            {(result) => <Users result={result} client={client} />}
          </Query>
        )}
      </ApolloConsumer>
    </div>
  )
}

export default App;
