import { gql } from '@apollo/client';

export const GET_ALL_VEHICLES = gql`
  query GetAllVehicles {
    getAllVehiclesNew {
      id
      name
      description
      price
      quantity
      seats
      fuel
      gear
        primaryimage{
            images
        }
    }
  }
`;


