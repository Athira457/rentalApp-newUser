"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { CREATE_ORDER_MUTATION } from '../services/createorderMutation';
import { VERIFY_PAYMENT_MUTATION } from '../services/verifyorderMutation';

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string; 
  description: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

interface RazorpayInstance {
  open(): void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface Order {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}


const Payment: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const amount = searchParams.get('amount');
  const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  // Use Apollo Client for the create order and verify payment mutations
  const [createOrder] = useMutation(CREATE_ORDER_MUTATION);
  const [verifyPayment] = useMutation(VERIFY_PAYMENT_MUTATION);

  useEffect(() => {
    if (!bookingId || !amount) {
      console.error('Missing bookingId or amount');
      return;
    }

    const loadRazorpay = () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => createOrderOnServer();
      script.onerror = () => console.error('Failed to load Razorpay SDK');
      document.body.appendChild(script);
    };

    // Create order in backend using GraphQL
    const createOrderOnServer = async () => {
      try {
        const { data } = await createOrder({
          variables: {
            bookingId: parseInt(bookingId || '', 10),
            amount: parseInt(amount || '', 10),
          },
        });

        if (data && data.createOrder) {
          openRazorpay(data.createOrder);
        }
      } catch (error) {
        console.error('Error creating order:', error);
      }
    };

    // Open Razorpay UI
    const openRazorpay = (order: Order) => {
      const options: RazorpayOptions = {
        key: razorpayKeyId as string,
        amount: order.amount, // Amount is already in paise
        currency: order.currency,
        order_id: order.id,
        name: 'Car Rental Service',
        description: `Payment for booking ${bookingId}`,
        handler: async (response: RazorpayResponse) => {
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;

          // Handle payment success
          await handlePaymentSuccess({ razorpay_order_id, razorpay_payment_id, razorpay_signature });
        },
        prefill: {
          email: 'your.email@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#F37254',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    };

    // Verify payment on the server using GraphQL
    const handlePaymentSuccess = async (response: RazorpayResponse) => {
      try {
        const { data } = await verifyPayment({
          variables: {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          },
        });

        if (data.verifyPayment.success) {
          router.push('/');
        } else {
          console.error('Payment verification failed:', data.verifyPayment.message);
          router.push('/');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
      }
    };

    loadRazorpay();
  }, [bookingId, amount, razorpayKeyId, createOrder, verifyPayment, router]);

  return (
    <div>
      <h1>Processing Payment...</h1>
    </div>
  );
};

export default Payment;
