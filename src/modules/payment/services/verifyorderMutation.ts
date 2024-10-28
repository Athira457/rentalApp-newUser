// GraphQL mutation for verifying payment
import { gql } from '@apollo/client';

export const VERIFY_PAYMENT_MUTATION = gql`
  mutation VerifyPayment($razorpay_order_id: String!, $razorpay_payment_id: String!, $razorpay_signature: String!) {
    verifyPayment(razorpay_order_id: $razorpay_order_id, razorpay_payment_id: $razorpay_payment_id, razorpay_signature: $razorpay_signature) {
      success
      message
    }
  }
`;