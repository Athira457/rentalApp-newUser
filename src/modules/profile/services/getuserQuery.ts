// queries.js (or wherever you define your queries)
import { gql } from '@apollo/client';

export const GET_USER_DETAILS = gql`
  query GetUserDetails($id: ID!) {
    getUserDetails(id: $id) {
      name
      email
      phone
      city
      state
      country
      pincode
    }
  }
`;
