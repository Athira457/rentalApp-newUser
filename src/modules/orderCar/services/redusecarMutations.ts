import { gql } from '@apollo/client';

export const REDUCE_VEHICLE = gql`
  mutation ReduceVehicleQuantity($id: ID!) {
    reduceVehicleQuantity(id: $id) {
      id
      quantity
    }
  }
`;
