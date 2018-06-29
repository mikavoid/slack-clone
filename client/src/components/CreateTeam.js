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

class CreateTeam extends Component {
  constructor (props) {
    super(props)

    this.state = {
      name: '',
      errors: []
    }
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.resetErrors = this.resetErrors.bind(this)
  }

  resetErrors () {
    this.setState({ errors: [] })
  }

  async onSubmit (e) {
    e.preventDefault()
    this.resetErrors()
    const { name } = this.state
    const { history } = this.props
    const response = await this.props.mutate({ variables: { name } })
    const { data: { createTeam: { ok, errors } } } = response
    if (ok) {
      console.log(response)
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
    const { name, errors } = this.state
    const printableErrors = []
    Object.keys(errors).forEach((k) => printableErrors.push(errors[k]))
    return (
      <div>
        <Container text>
          <Header as='h2'>Create Team</Header>
          <Form onSubmit={this.onSubmit}>
            <Form.Field error={!!errors.name}>
              <Input
                name='name'
                onChange={this.onChange}
                value={name}
                placeholder='name'
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

const createTeamMutation = gql`
  mutation CreateTeam($name: String!) {
    createTeam(name: $name) {
      ok
      errors {
        path
        message
      }
    }
  }
`

export default graphql(createTeamMutation)(CreateTeam)
