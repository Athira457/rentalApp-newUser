// services/bookingMutations.ts
import { gql } from '@apollo/client';

export const CREATE_BOOKING = gql`
  mutation CreateBooking(
    $pickupCity: String
    $pickupLocation: String
    $dropoffLocation: String
    $pickupTime: String
    $dropoffTime: String
    $bookBy: String
    $userId: Int
    $vehicleName: String
    $vId: Int
    $totalRent: Int
  ) {
    createBooking(
      pickupCity: $pickupCity
      pickupLocation: $pickupLocation
      dropoffLocation: $dropoffLocation
      pickupTime: $pickupTime
      dropoffTime: $dropoffTime
      bookBy: $bookBy
      userId: $userId
      vehicleName: $vehicleName
      vId: $vId
      totalRent: $totalRent
    ) {
      id
      vehicleName
      pickupCity
      bookBy
    }
  }
`;
