// apollo-client.js
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Step 1: Create an HTTP link to your GraphQL endpoint
const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql', 
});

// Step 2: Create a middleware link to include the token in the request header
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from sessionStorage (or localStorage)
  const token = sessionStorage.getItem('token');

  // Return the headers with the authorization token if it exists
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Step 3: Create the Apollo Client instance
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
              return userId ? JSON.parse(userId) : null; // return user ID from cache
            },
          },
        },
      },
    },
  }),
});

export default client;
