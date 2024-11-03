// Bookings details displaying page
"use client";
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_BOOKINGS_BY_USER } from '../services/getUserbookings';
import styles from './bookDetails.module.css';
import arrow from '../../../themes/images/back.svg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Booking {
  id: string;
  pickupCity: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupTime: string;
  dropoffTime: string;
  createdAt: string;
  bookBy: string;
  userId: number;
  vehicleName: string;
  vId: number;
  totalRent: number;
}

const formatDate = (timestamp: string | number) => {
  const date = new Date(Number(timestamp));
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  return date.toISOString().split('T')[0];
};

const BookingsList = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUserId = sessionStorage.getItem('userId');
    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10)); 
    }
  }, []);

  const { loading, error, data } = useQuery(GET_BOOKINGS_BY_USER, {
    variables: { userId },
  });

  const handleBack = () => {
    router.push('/')
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className={styles.bookingsContainer}>
       <div className={styles.backDiv}>
        <button className={styles.backBtn} onClick={handleBack}>
        <Image src={arrow} width={25} height={25} alt="bookings" />
        </button>
      </div>
      <h2 className={styles.title}>Booking Details</h2>
      {data.getBookingById.length > 0 ? (
        <div className={styles.bookingsList}>
          {data.getBookingById.map((booking: Booking) => (
            <div className={styles.bookingCard} key={booking.id}>
              <h3>{booking.vehicleName}</h3>
              <p className={styles.paragraph}><strong className={styles.strong}>Pickup City:</strong> {booking.pickupCity}</p>
              <p className={styles.paragraph}><strong className={styles.strong}>Pickup Location:</strong> {booking.pickupLocation}</p>
              <p className={styles.paragraph}><strong className={styles.strong}>Dropoff Location:</strong> {booking.dropoffLocation}</p>
              <p className={styles.paragraph}><strong className={styles.strong}>Pickup Time:</strong> {formatDate(booking.pickupTime)}</p>
              <p className={styles.paragraph}><strong className={styles.strong}>Dropoff Time:</strong>{formatDate(booking.dropoffTime)}</p>
              <p className={styles.paragraph}><strong className={styles.strong}>Booked By:</strong> {booking.bookBy}</p>
              <p className={styles.paragraph}><strong className={styles.strong}>Total Rent:</strong> {booking.totalRent}/-</p>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.message}>No bookings found for this user.</p>
      )}
    </div>
  );
};

export default BookingsList;
