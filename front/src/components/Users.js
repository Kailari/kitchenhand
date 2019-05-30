import React, { useState } from 'react'
import { gql } from 'apollo-boost'

const FIND_USER = gql`
query findUserById($id: ID!) {
  findUser(id: $id) {
    id
    name
  }
}
`

const Users = ({ result, client }) => {
  const [user, setUser] = useState(null)

  if (result.loading) {
    return <div>Loading...</div>
  }

  const showUserProfile = async (id) => {
    const { data } = await client.query({
      query: FIND_USER,
      variables: { id: id }
    })
    setUser(data.findUser)
  }

  if (user) {
    return (
      <div>
        <h2>{user.name}</h2>
        <div>{user.id}</div>
        <button onClick={() => setUser(null)}>back</button>
      </div>
    )
  }


  return (
    <div>
      <h2>Users</h2>
      {result.data.allUsers.map(u =>
        <div key={u.id}>
          {u.name} 
          <button onClick={() => {
            showUserProfile(u.id)
          }}>show profile</button>
        </div>
      )}
    </div>
  )
}

export default Users