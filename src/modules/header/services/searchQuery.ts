import { gql } from '@apollo/client';

export const SEARCH_VEHICLES = gql`
query SearchVehicles($searchTerm: String!) {
  searchVehicle(searchTerm: $searchTerm) {
    id
    name
    model
    manufacturer
    price
  }
}
`;
