"use client";
import { useSearchParams } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client';
import { useState } from 'react';
import { GET_VEHICLE_BY_ID } from '../services/carQueries';
import { GET_USER_DETAILS } from '../services/userGetQuery';
import { CREATE_BOOKING } from '../services/bookingMutations';
import styles from './order.module.css';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx'; 

const OrderForm: React.FC = () => {
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get('id');
  const userId = sessionStorage.getItem('userId');
  const router = useRouter();

  // Query to fetch vehicle details by ID
  const { data: vehicleData, error: vehicleError } = useQuery(GET_VEHICLE_BY_ID, {
    variables: { id: vehicleId },
  });

  // Query to fetch user details
  const { data: userData, error: userError } = useQuery(GET_USER_DETAILS, {
    variables: { id: userId },
  });

  // Mutation for creating a booking
  const [createBooking] = useMutation(CREATE_BOOKING);

  const [selectedCity, setSelectedCity] = useState<'kochi' | 'trivandram' | 'calicut' | null>(null);
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [message, setMessage] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [dropoffTime, setDropoffTime] = useState('');
  const [totalRent, setTotalRent] = useState<number | null>(null); 

  const locations = {
    kochi: ["Cochin international airport", "North railway station", "South railway station"],
    trivandram: ["Trivandrum international airport", "Trivandrum central railway station", "Near Sree Padmanabhaswamy Temple"],
    calicut: ["SM Street", "Calicut International Airport", "Calicut Railway Station"],
  };

  const calculateTotalRent = () => {
    if (pickupTime && dropoffTime && vehicleData) {
      const pickupDate = new Date(pickupTime);
      const dropoffDate = new Date(dropoffTime);
      const timeDifference = dropoffDate.getTime() - pickupDate.getTime();
      const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); 

      // Ensure at least 1 day is charged even if the times are within the same day
      const rentDays = daysDifference > 0 ? daysDifference : 1;
      const pricePerDay = vehicleData.getVehicleImageById.price;
      const total = rentDays * pricePerDay;

      setTotalRent(total);
      return total;
    }
    return 0;
  };

  // Function to export booking details to Excel
  const exportToExcel = () => {
    const bookingData = [
      {
        'Pick-up City': selectedCity,
        'Pick-up Location': pickupLocation,
        'Drop-off Location': dropoffLocation,
        'Pick-up Time': pickupTime,
        'Drop-off Time': dropoffTime,
        'Booked By': userData.getUserDetails.name,
        'Vehicle Name': vehicleData.getVehicleImageById.name,
        'Total Rent': totalRent,
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(bookingData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'BookingDetails');
    XLSX.writeFile(workbook, 'BookingDetails.xlsx');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const total = calculateTotalRent();
    try {
      const { data } = await createBooking({
        variables: {
          pickupCity: selectedCity,
          pickupLocation: pickupLocation,
          dropoffLocation: dropoffLocation,
          pickupTime: pickupTime,
          dropoffTime: dropoffTime,
          bookBy: userData.getUserDetails.name, 
          userId: parseInt(userId || '', 10),
          vehicleName: vehicleData.getVehicleImageById.name, 
          vId: parseInt(vehicleId || '', 10),
          totalRent: total, 
        },
      });

      setMessage(`Booking confirmed for ${vehicleData.getVehicleImageById.name}. Total rent: ${total}`);
      router.push(`/payCar?bookingId=${data.createBooking.id}&amount=${total}`);
    } catch (error) {
      console.error('Error creating booking:', error);
      setMessage('Error creating booking, please try again.');
    }
  };

  const handleCityChange = (city: 'kochi' | 'trivandram' | 'calicut') => {
    setSelectedCity((prevCity) => (prevCity === city ? null : city));
    setPickupLocation('');
  };

  const getLocationOptions = () => {
    if (selectedCity) {
      return locations[selectedCity].map((location, index) => (
        <option key={index} value={location}>{location}</option>
      ));
    }
    return <option value="">Select a city first</option>;
  };

  if (vehicleError || userError) {
    return <p>Error loading data: {vehicleError?.message || userError?.message}</p>;
  }

  if (!vehicleData || !userData) return <p>Loading...</p>;

  return (
    <div className={styles.orderContainer}>
      <h2 className={styles.title}>Book {vehicleData.getVehicleImageById.name}</h2>
      <form onSubmit={handleSubmit} className={styles.bookingForm}>
        {/* City Checkboxes */}
        <div className={styles.formGroup}>
          <label>Pick-up City</label>
          <div className={styles.checkboxGroup}>
            <label>
              <input
                type="checkbox"
                checked={selectedCity === 'kochi'}
                onChange={() => handleCityChange('kochi')}
              />
              Kochi
            </label>
            <label>
              <input
                type="checkbox"
                checked={selectedCity === 'trivandram'}
                onChange={() => handleCityChange('trivandram')}
              />
              Trivandram
            </label>
            <label>
              <input
                type="checkbox"
                checked={selectedCity === 'calicut'}
                onChange={() => handleCityChange('calicut')}
              />
              Calicut
            </label>
          </div>
        </div>

        {/* Pick-up Location Dropdown */}
        <div className={styles.formGroup}>
          <label htmlFor="pickupLocation">Pick-up Location</label>
          <select
            className={styles.input}
            id="pickupLocation"
            name="pickupLocation"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            required
            disabled={!selectedCity} 
          >
            <option value="">Select Pick-up Location</option>
            {getLocationOptions()}
          </select>
        </div>

        {/* Drop-off Location Dropdown */}
        <div className={styles.formGroup}>
          <label htmlFor="dropoffLocation">Drop-off Location</label>
          <select
            className={styles.input}
            id="dropoffLocation"
            name="dropoffLocation"
            value={dropoffLocation}
            onChange={(e) => setDropoffLocation(e.target.value)}
            required
          >
            <option value="">Select Drop-off Location</option>
            {getLocationOptions()}
          </select>
        </div>

        {/* Pickup Time */}
        <div className={styles.formGroup}>
          <label htmlFor="pickupTime">Pick-up Time</label>
          <input
            type="datetime-local"
            className={styles.input}
            id="pickupTime"
            name="pickupTime"
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            required
          />
        </div>

        {/* Drop-off Time */}
        <div className={styles.formGroup}>
          <label htmlFor="dropoffTime">Drop-off Time</label>
          <input
            type="datetime-local"
            className={styles.input}
            id="dropoffTime"
            name="dropoffTime"
            value={dropoffTime}
            onChange={(e) => setDropoffTime(e.target.value)}
            required
          />
        </div>
         {/* Export to Excel Button */}
        <button type="button" className={styles.exportButton} onClick={exportToExcel}>
          Export Booking Details to Excel
        </button>

        {/* Submit Button */}
        <button type="submit" className={styles.submitButton}>
          Confirm Booking
        </button>
      </form>
      {/* Display success or error message */}
      {message && <p>{message}</p>}
    </div>
  );
};

export default OrderForm;
