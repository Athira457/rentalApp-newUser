// apollo-client.js
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Create an HTTP link to your GraphQL endpoint
const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql', 
});

// Create a middleware link to include the token in the request header
const authLink = setContext((_, { headers }) => {
  const token = sessionStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Create the Apollo Client instance
const client = new ApolloClient({
  // Combine the authLink and httpLink
  link: authLink.concat(httpLink), 
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          currentUser: {
            read() {
              // You can retrieve the user ID from sessionStorage
              const userId = sessionStorage.getItem('userId');
              return userId ? JSON.parse(userId) : null; 
            },
          },
        },
      },
    },
  }),
});

export default client;
