"use client";
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import CustomInput from '../../../utils/customInput';
import CustomButton from '../../../utils/customButton';
import styles from './register.module.css';
import { REGISTER_NEW_USER } from '../services/mutations'; 

// Define the GraphQL mutation
const Register: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [message, setMessage] = useState('');
  
    const [registerUser] = useMutation(REGISTER_NEW_USER);
  
    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        const response = await registerUser({
          variables: {
            name: formData.name,
            email: formData.email,
            password: formData.password, 
          },
        });
        
        if (response.data="success") {
          setMessage('User registered successfully!');
        } else {
          setMessage('Registration failed. Please try again.');
        }
      } catch (err) {
        console.error('Error during registration:', err);
      }
    };
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };
  
    return (
      <div className="register-container">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <CustomInput
            type="text"
            placeholder="Name"
            value={formData.name}
            name="name"
            onChange={handleChange}
            className={styles.input}
          />
          <CustomInput
            type="email"
            placeholder="Email"
            value={formData.email}
            name="email"
            onChange={handleChange}
            className={styles.input}
          />
          <CustomInput
            type="password"
            placeholder="Password"
            value={formData.password}
            name="password"
            onChange={handleChange}
            className={styles.input}
          />
          <CustomButton type="submit" className={styles.button}>
            Register
          </CustomButton>
        </form>
        {message && <p>{message}</p>}
      </div>
    );
  };
  
  export default Register;