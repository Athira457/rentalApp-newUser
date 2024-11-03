"use client";
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER_DETAILS } from '../services/getuserQuery';
import { UPDATE_USER_DETAILS } from '../services/updateuserMutation';
import styles from './profile.module.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import arrow from '../../../themes/images/back.svg';
import defaultProfileImg from '../../../themes/images/profileimg.svg';

interface FormData {
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

const ProfilePage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
  });
  
  const router = useRouter();

  useEffect(() => {
    const storedUserId = sessionStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const { data: userData, error: userError, loading } = useQuery(GET_USER_DETAILS, {
    variables: { id: userId },
    skip: !userId,
    onCompleted: data => {
      setFormData({
        name: data.getUserDetails.name || '',
        email: data.getUserDetails.email || '',
        phone: data.getUserDetails.phone || '',
        city: data.getUserDetails.city || '',
        state: data.getUserDetails.state || '',
        country: data.getUserDetails.country || '',
        pincode: data.getUserDetails.pincode || '',
      });
    }
  });

  const [updateProfile, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_USER_DETAILS);

  const handleBack = () => {
    router.push('/');
  };

  const handleImageClick = () => {
    document.getElementById('fileInput')?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    console.log("Profile Image:", profileImage);
    try {
      const { data } = await updateProfile({
        variables: {
          id: userId,
          ...formData,
          file: profileImage
        }
      });
      console.log(data,":updated data")
      alert('Profile updated successfully!');
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (userError) return <p>Error fetching user details: {userError.message}</p>;
  if (!userData || !userData.getUserDetails) return <p>No user data found</p>;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.backDiv}>
        <button className={styles.backBtn} onClick={handleBack}>
          <Image src={arrow} width={25} height={25} alt="Go back" />
        </button>
      </div>
      <h1 className={styles.title}>USER PROFILE</h1>

      {/* Profile Image Section */}
      <div className={styles.profileImageContainer} onClick={handleImageClick}>
        <Image 
          src={profileImage ? URL.createObjectURL(profileImage) : userData.getUserDetails.profileImage || defaultProfileImg} 
          alt="Profile picture" 
          width={100} 
          height={100} 
          className={styles.profileImage} 
        />
      </div>
      <input 
        id="fileInput" 
        type="file" 
        accept="image/*" 
        style={{ display: 'none' }} 
        onChange={handleImageChange} 
      />

      <div className={styles.profileDetails}>
        {(Object.keys(formData) as (keyof FormData)[]).map((field) => (
          <label className={styles.paragraph} key={field}>
            <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>
            <input 
              type="text" 
              name={field} 
              value={formData[field]} 
              onChange={handleInputChange} 
              className={styles.inputField} 
            />
          </label>
        ))}
        
        <button className={styles.saveButton} onClick={handleUpdate} disabled={updateLoading}>
          {updateLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
      {updateError && <p className={styles.error}>Error updating profile: {updateError.message}</p>}
    </div>
  );
};

export default ProfilePage;
