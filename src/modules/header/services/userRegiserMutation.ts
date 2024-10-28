import { gql } from '@apollo/client';

export const REGISTER_USER = gql`
  mutation(
      $name: String!,
      $email: String!,
      $phone: String!,
      $city: String!,
      $state: String!,
      $country: String!,
      $pincode: String!,
      $password: String!,
  ) {
    registerUser(
      name: $name,
      email: $email,
      phone: $phone,
      city: $city,
      state: $state,
      country: $country,
      pincode: $pincode,
      password: $password,
    ) {
      name
      email
      phone
      city
      state
      country
      pincode
      password
    }
  }
`;
