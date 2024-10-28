import { gql } from '@apollo/client';

export const REGISTER_NEW_USER = gql`
  mutation RegisterNewUser($name: String!, $email: String!, $password: String!) {
    createUser(name: $name, email: $email, password: $password) {
      name
      email   
  }
  }
`;
