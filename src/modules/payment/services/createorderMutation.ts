// GraphQL mutation for creating an order
import { gql } from '@apollo/client';

export const CREATE_ORDER_MUTATION = gql`
  mutation CreateOrder($bookingId: Int!, $amount: Int!) {
    createOrder(bookingId: $bookingId, amount: $amount) {
      id
      amount
      currency
      receipt
    }
  }
`;