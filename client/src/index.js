import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloClient } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { ApolloLink } from 'apollo-link'
import { InMemoryCache } from 'apollo-cache-inmemory'
import 'semantic-ui-css/semantic.min.css'
import registerServiceWorker from './registerServiceWorker'

import Routes from './routes'

const httpLink = createHttpLink({
  uri: 'http://localhost:4040/graphql'
})

const middlewareLink = setContext(() => ({
  headers: {
    'x-token': localStorage.getItem('token'),
    'x-refresh-token': localStorage.getItem('refreshToken')
  }
}))

const afterwareLink = new ApolloLink((operation, forward) => {
  return forward(operation).map(response => {
    const { response: { headers } } = operation.getContext()
    if (headers) {
      const token = headers.get('x-token')
      const refreshToken = headers.get('x-refresh-token')

      token && localStorage.setItem('token', token)
      refreshToken && localStorage.setItem('refreshToken', refreshToken)
    }

    return response
  })
})

const httpLinkWithMiddleware = afterwareLink.concat(
  middlewareLink.concat(httpLink)
)

const client = new ApolloClient({
  link: httpLinkWithMiddleware,
  cache: new InMemoryCache()
})

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Routes />
    </ApolloProvider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()
