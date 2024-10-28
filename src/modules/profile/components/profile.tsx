"use client";
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_DETAILS } from '../services/getuserQuery';
import styles from './profile.module.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import arrow from '../../../themes/images/back.svg';

const ProfilePage = () => {
  // Set userId state to be either string or null
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  // Use useEffect to safely access sessionStorage on the client side
  useEffect(() => {
    const storedUserId = sessionStorage.getItem('userId');
    console.log("userId:",storedUserId)
    if (storedUserId) {
      setUserId(storedUserId); 
    }
  }, []);

  const { data: userData, error: userError, loading } = useQuery(GET_USER_DETAILS, {
    variables: { id: userId },
    skip: !userId, // Skip the query if userId is not available
  });
  console.log("userDetails:",userData)

  if (loading) return <p>Loading...</p>;
  if (userError) return <p>Error fetching user details: {userError.message}</p>;

  // Adjusted this line
  if (!userData || !userData.getUserDetails) return <p>No user data found</p>;

  const { name, email, phone, city, state, country, pincode } = userData.getUserDetails;

  const handleBack = () => {
    router.push('/')
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.backDiv}>
        <button className={styles.backBtn} onClick={handleBack}>
        <Image src={arrow} width={25} height={25} alt="bookings" />
        </button>
      </div>
      <h1 className={styles.title}>USER PROFILE</h1>
      <div className={styles.profileDetails}>
        <p className={styles.paragraph}><strong>Name:</strong> {name}</p>
        <p className={styles.paragraph}><strong>Email:</strong> {email}</p>
        <p className={styles.paragraph}><strong>Phone:</strong> {phone}</p>
        <p className={styles.paragraph}><strong>City:</strong> {city}</p>
        <p className={styles.paragraph}><strong>State:</strong> {state}</p>
        <p className={styles.paragraph}><strong>Country:</strong> {country}</p>
        <p className={styles.paragraph}><strong>Pincode:</strong> {pincode}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
