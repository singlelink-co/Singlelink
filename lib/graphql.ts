import { ApolloClient, concat, HttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
// @ts-ignore

const authLink = setContext(async (_ : any, { headers } : { headers: any}) => {
  const jwt = await localStorage.getItem('jwt')

  const newContext: any = {
    headers: {
      ...headers,
      accept: 'application/json',
    },
  }

  if (jwt) {
    newContext['headers'].authorization = `Bearer ${jwt}`
  }

  return newContext
})

const httpLink = new HttpLink({
  credentials: 'include', // Additional fetch() options like `credentials` or `headers`
  uri: '/api/graphql',
})

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authLink, httpLink),
})