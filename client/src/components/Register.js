import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import {
  Input,
  Container,
  Header,
  Button,
  Message,
  Form
} from 'semantic-ui-react'

class Register extends Component {
  constructor (props) {
    super(props)

    this.state = {
      username: '',
      email: '',
      password: '',
      errors: []
    }

    this.onInputChange = this.onInputChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.reset = this.reset.bind(this)
  }

  reset () {
    return this.setState({ errors: [] })
  }

  async onSubmit (e) {
    e.preventDefault()
    await this.reset()
    const { username, email, password } = this.state
    const { data: { register: { ok, errors = [] } } } = await this.props.mutate({ variables: { username, email, password } })
    if (ok) return this.props.history.push('/')
    this.setState({
      errors: Object.assign(...errors.map((e) => ({ [ e.path ]: e.message })))
    })
  }

  onInputChange (e) {
    const { name, value } = e.target
    this.setState({[name]: value})
  }
  render () {
    const { username, email, password, errors } = this.state
    const printableErrors = []
    Object.keys(errors).forEach((k) => printableErrors.push(errors[k]))
    return (
      <Container text>
        <Header as='h2'>Register</Header>
        <Form onSubmit={this.onSubmit}>
          <Form.Field error={!!errors.username}>
            <Input
              name='username'
              onChange={this.onInputChange}
              value={username}
              placeholder='username'
              fluid />
          </Form.Field>
          <Form.Field error={!!errors.email}>
            <Input
              name='email'
              onChange={this.onInputChange}
              value={email}
              placeholder='email'
              fluid />
          </Form.Field>
          <Form.Field error={!!errors.password}>
            <Input
              name='password'
              onChange={this.onInputChange}
              value={password}
              placeholder='password'
              type="password"
              fluid />
          </Form.Field>
          <Form.Field>
            <Button type="submit">Submit</Button>
          </Form.Field>
        </Form>
        {(printableErrors.length) ? <Message
          error
          header="There was some errors with your submission"
          list={printableErrors}/> : null}
      </Container>
    )
  }
}

const registerMutation = gql`
mutation Register($username: String!, $email: String!, $password: String!) {
  register(username: $username, email: $email, password: $password) {
    ok
    errors {
      path
      message
    }
  }
}
`

export default graphql(registerMutation)(Register)
