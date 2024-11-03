"use client";
import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import styles from './header.module.css'; 
import { REGISTER_USER } from '../services/userRegiserMutation';
import { LOGIN_USER } from '../services/userLoginMutation';
import frame from '../../../themes/images/Frame.svg';
import { gql, useApolloClient } from '@apollo/client';
import Link from 'next/link';
import Image from 'next/image';

const Header: React.FC = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [logMessage, setLogMessage] = useState('');
  const [passwordError, setPasswordError] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [loginError, setLoginError] = useState(""); 
  const [useremail, setUserEmail] = useState('');
  const [userpassword, setUserPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const client = useApolloClient();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) setIsLoggedIn(true);
  }, []);

   // Toggle the active form (login or register)
   const toggleForm = (tab: string) => {
    if (activeTab === tab && showForm) {
      setShowForm(false); 
    } else {
      setActiveTab(tab);
      setShowForm(true);
    }
  };

  const [registerUser] = useMutation(REGISTER_USER);
  const [loginUser] = useMutation(LOGIN_USER);

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submit
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
  //check password and confirm password are matching
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    try {
      // Call mutation and pass form data as input
      const response = await registerUser({
        variables: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          pincode: formData.pincode,
          password: formData.password,
        }
      });

      if (response.data) {
        setMessage('User Registration successful!');
        setRegistrationSuccess(true);
      } else {
        setMessage('Creation failed. Please try again.');
      }
    } catch (err) {
      console.error('Error during user registration:', err);
      setMessage('An error occurred. Please try again.');
    }
  };

   // Handle login form submit
   const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(""); 
    try {
      const res = await loginUser({
        variables: {
          email: useremail,
          password: userpassword,
        }
      });    
      
      const { token, user } = res.data.loginUser; 
      console.log("user details:",user);     
      
      if (token) {
        sessionStorage.setItem('token', token); 
        sessionStorage.setItem('userId', user.id); 
         // Save user ID in Apollo cache
        client.writeQuery({
          query: gql`
            query GetCurrentUser {
              currentUser @client
            }
          `,
          data: {
            currentUser: user.id,
          },
      });
      console.log('User ID stored in Apollo cache:', user.id);      
        setLogMessage('Login successful!'); 
        setIsLoggedIn(true);
        setShowForm(false);
      } else {
        setLoginError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Error during login:', err);
      setLoginError('An error occurred during login. Please try again.');
    }
  };


  const closeModal = () => {
    // Close the modal and form 
    setRegistrationSuccess(false); 
    setShowForm(false);
  };

  const loginClose = () => {
    setShowForm(false); 
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    client.clearStore(); 
    setIsLoggedIn(false); 
  };


  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
      <Image src={frame} alt="logo" width={25} height={25} />
        <Link href="/"><h1 className={styles.appName}>CAR RENTAL</h1></Link>
      </div>

      <div className={styles.loginContainer}>
      {isLoggedIn ? (
          // "My Account" dropdown when logged in
          <div className={styles.accountDropdown}>
            <button
              className={styles.loginButton}
              onClick={() => setShowAccountDropdown(!showAccountDropdown)}
            >
              My Account
            </button>
            {showAccountDropdown && (
              <div className={styles.dropdownContent}>
                <Link href="/profile" className={styles.dropdownItem}>Profile
                </Link>
                <Link href="/bookDetails" className={styles.dropdownItem}>Booking Details
                </Link>
                <button className={styles.dropdownItem} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          // Login/Register buttons when not logged in
          <>
            <button
              onClick={() => toggleForm("login")}
              className={styles.loginButton}
            >
              Login
            </button>
            /
            <button
              onClick={() => toggleForm("register")}
              className={styles.loginButton}
            >
              Register
            </button>
          </>
        )}

      {/* Conditionally render the login or register form */}
      {
       showForm && (
        <div className={styles.loginForm}>
          {activeTab === 'login' && (
            <div>
              <div className={styles.topLog}>              
                <button onClick={loginClose}>X</button>
              </div>
              <h2>Login</h2>
              <form onSubmit={handleLogin}>
                <input
                  type="email"
                  placeholder="Email" 
                  name="email" 
                  value={useremail}  
                  onChange={(e) => setUserEmail(e.target.value)} 
                  className={styles.input} 
                  required 
                />

                <input 
                  type="password" 
                  placeholder="Password" 
                  name="password"
                  value={userpassword}  
                  onChange={(e) => setUserPassword(e.target.value)}
                  className={styles.input} 
                  required 
                />
                <button type="submit" className={styles.submitButton}>Login</button>
              </form>
              {logMessage && <p className={styles.success}>{logMessage}</p>}
              {loginError && <p className={styles.error}>{loginError}</p>} 
            </div>
          )}

          {activeTab === 'register' && (
            <div>
              <div className={styles.topLog}>              
                <button onClick={loginClose}>X</button>
              </div>
              <h2>Register</h2>
              <form onSubmit={handleRegister}>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                />
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                />
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pin Code"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                /> 
                {/* Display password mismatch error */}
                {passwordError && (
                  <p className={styles.error}>{passwordError}</p>
                )}
                <button type="submit" className={styles.submitButton}>
                  Register
                </button>
              </form>
              {message && <p className={styles.paragraph}>{message}</p>}
            </div>
          )}
        </div>
      )}
       {/* Modal for successful registration */}
       {registrationSuccess && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h3 className={styles.modalh3}>Registration successful!</h3>
              <p className={styles.modalp}>You can now log in.</p>
              <button onClick={closeModal} className={styles.closeButton}>
                Close
              </button>
            </div>
          </div>
        )}
    </div>

    </header>
  );
};

export default Header;