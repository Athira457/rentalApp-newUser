import { gql } from '@apollo/client';

export const GET_USER_DETAILS = gql`
  query GetUserDetails($id: ID!) {
    getUserDetails(id: $id) {
      id
      name
      email
    }
  }
`;
