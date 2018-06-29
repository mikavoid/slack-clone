import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

class Home extends Component {
  render () {
    const { data: { users = [] } } = this.props
    return users.map((u) => <p key={u.id}>{u.email}</p>)
  }
}

const getAllUsersQuery = gql`
query {
  users:getAllUsers {
    id
    username
    email
  }
}
`

export default graphql(getAllUsersQuery)(Home)
