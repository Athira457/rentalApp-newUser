// graph ql query to get book details by id
import { gql } from '@apollo/client';

export const GET_BOOKINGS_BY_USER = gql`
  query GetBookingById($userId: Int) {
    getBookingById(userId: $userId) {
      id
      pickupCity
      pickupLocation
      dropoffLocation
      pickupTime
      dropoffTime
      createdAt
      bookBy
      userId
      vehicleName
      vId
      totalRent
    }
  }
`;
