"use client";
import { useSearchParams, useRouter } from 'next/navigation'; 
import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { GET_VEHICLE_BY_ID } from '../services/carQueries'; 
import styles from './singleCard.module.css';
import Image from 'next/image';
import arrow from '../../../themes/images/back.svg';

const VehicleDetails: React.FC = () => {
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get('id');
  const router = useRouter(); 
  const [showLoginModal, setShowLoginModal] = useState(false); 

  console.log('Vehicle ID:', vehicleId);

  // Query to fetch vehicle details by ID
  const { data, error } = useQuery(GET_VEHICLE_BY_ID, {
    variables: { id: vehicleId },
  });

  // Handling loading and error states
  if (error) return <p>Error loading vehicle details: {error.message}</p>;
  if (!data || !data.getVehicleImageById) return <p>No vehicle found.</p>;

  const vehicle = data.getVehicleImageById;

  const handleRent = (id: string) => {
    // Check if user is logged in by checking token 
    const token = sessionStorage.getItem('token'); 

    if (token) {
      // If the token exists, redirect to the order page
      const encodedId = encodeURIComponent(id);
      router.push(`/orderCar?id=${encodedId}`);
    } else {
      // If no token, show login modal
      setShowLoginModal(true);
    }
  };

  const handleBack = () => {
    router.push('/')
  };

  return (
    <div className={styles.container}>
       <div className={styles.backDiv}>
        <button className={styles.backBtn} onClick={handleBack}>
        <Image src={arrow} width={25} height={25} alt="bookings" />
        </button>
      </div>
      <h2 className={styles.vehicleName}>{vehicle.name}</h2>
      <div className={styles.imageGallery}>
        {vehicle.secondaryimages?.map((imageObj: { images: string }, index: number) => (
          <Image
            key={index}
            src={imageObj.images[0]}
            alt={`${vehicle.name} image ${index + 1}`}
            className={`${styles.vehicleImage} ${index === 1 ? styles.centerImage : ''}`} 
            width={200}
            height={200}
          />
        ))}
      </div>
      <p className={styles.vehicleDescription}>{vehicle.description}</p>
      <p className={styles.vehiclePrice}>Price: {vehicle.price} /day</p>
      <button onClick={() => handleRent(vehicle.id)} className={styles.rentButton}>
        Rent Now
      </button>

      {/* Login Modal */}
      {showLoginModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <p className={styles.paragraph}>Please log in to proceed with booking</p>
            <button onClick={() => setShowLoginModal(false)} className={styles.closeButton}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleDetails;
