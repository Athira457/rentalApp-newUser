import { gql } from '@apollo/client';

export const UPDATE_USER_DETAILS = gql`
  mutation updateProfile(
    $id: ID!,
    $name: String,
    $email: String,
    $phone: String,
    $city: String,
    $state: String,
    $country: String,
    $pincode: String,
    $file: Upload,
  ) {
    updateProfile(
      id: $id,
      name: $name,
      email: $email,
      phone: $phone,
      city: $city,
      state: $state,
      country: $country,
      pincode: $pincode,
      file: $file,
    ) {
      id
      name
      email
      phone
      city
      state
      country
      pincode
      imageurl
    }
  }
`;
