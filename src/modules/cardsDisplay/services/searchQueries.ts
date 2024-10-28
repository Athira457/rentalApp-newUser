import { gql } from '@apollo/client';

// Query to search vehicle by typesense
export const SEARCH_VEHICLES = gql`
query searchVehiclesByName($searchTerm: String) {
  searchVehiclesByName(searchTerm: $searchTerm) {
    id
    name
    price
    quantity
    seats
    fuel
    gear
    primaryImage
  }
}
`;

export const FILTER_VEHICLES = gql`
 query FilterVehiclesByPrice($minPrice: Float, $maxPrice: Float) {
    filterVehiclesByPrice(minPrice: $minPrice, maxPrice: $maxPrice) {
      id
      name
      price
      quantity
      seats
      fuel
      gear
      primaryImage
    }
  }
`;