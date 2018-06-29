import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import {
  Input,
  Container,
  Header,
  Button,
  Form,
  Message
} from 'semantic-ui-react'

class Login extends Component {
  constructor (props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      errors: []
    }
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.reset = this.reset.bind(this)
  }

  reset () {
    this.setState({ errors: [] })
  }

  async onSubmit (e) {
    e.preventDefault()
    this.reset()
    const { email, password } = this.state
    const { history } = this.props
    const response = await this.props.mutate({ variables: { email, password } })
    const { data: { login: { ok, token, refreshToken, errors } } } = response
    if (ok) {
      localStorage.setItem('token', token)
      localStorage.setItem('refreshToken', refreshToken)
      history.push('/')
    } else {
      this.setState({ errors: Object.assign(...errors.map((e) => ({ [ e.path ]: e.message }))) }, () => console.log(this.state))
    }
  }

  onChange (e) {
    const { name, value } = e.target
    this.setState({[name]: value})
  }

  render () {
    const { email, password, errors } = this.state
    const printableErrors = []
    Object.keys(errors).forEach((k) => printableErrors.push(errors[k]))
    return (
      <div>
        <Container text>
          <Header as='h2'>Login</Header>
          <Form onSubmit={this.onSubmit}>
            <Form.Field error={!!errors.email}>
              <Input
                name='email'
                onChange={this.onChange}
                value={email}
                placeholder='email'
                fluid />
            </Form.Field>
            <Form.Field error={!!errors.password}>
              <Input
                name='password'
                onChange={this.onChange}
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
      </div>
    )
  }
}

const loginMutation = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      token
      refreshToken
      errors {
        path
        message
      }
    }
  }
`

export default graphql(loginMutation)(Login)
