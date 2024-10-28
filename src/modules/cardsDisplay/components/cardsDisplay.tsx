"use client";
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_VEHICLES } from '../services/cardQueries';
import { SEARCH_VEHICLES, FILTER_VEHICLES } from '../services/searchQueries';
import styles from './cardsDisplay.module.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import CustomButton from '@/utils/customButton';
import seat from '../../../themes/images/seatcar.svg';
import fuel from '../../../themes/images/fuel.svg';
import gear from '../../../themes/images/gear.svg';

interface Vehicle {
  id: string;
  name: string;
  price: number;
  quantity: number;
  seats: number;
  fuel: string;
  gear: string;
  primaryimage?: {
    images: string;
  };
  primaryImage?: string;
}

// Predefined price ranges
const priceRanges = [ 
  { label: 'All', min: 0, max: Infinity },
  { label: 'Under 4,000', min: 0, max: 4000 },
  { label: '4,000 - 5,000', min: 4000, max: 5000 },
  { label: '5,000 - 6,000', min: 5000, max: 6000 },
  { label: 'Above 6,000', min: 7000, max: Infinity },
];

const VehicleCards = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
  const [isFiltering, setIsFiltering] = useState(false);

  // Search vehicles query
  const { data: searchData, loading: searchLoading } = useQuery(SEARCH_VEHICLES, {
    variables: { searchTerm },
    skip: isFiltering, 
  });

  const { data: filterData, loading: filterLoading } = useQuery(FILTER_VEHICLES, {
    variables: { minPrice: selectedPriceRange.min, maxPrice: selectedPriceRange.max },
    skip: !isFiltering,
  });

  // Get all vehicles query
  const { data: allVehiclesData, loading: allVehiclesLoading } = useQuery(GET_ALL_VEHICLES, {
    skip: isFiltering,
  });

  // Determine which data to use
  const vehicles = isFiltering 
    ? filterData?.filterVehiclesByPrice 
    : searchTerm 
      ? searchData?.searchVehiclesByName 
      : allVehiclesData?.getAllVehiclesNew;

  if (searchLoading || filterLoading || allVehiclesLoading) return <p>Loading...</p>;

  // Rent Car Handler
  const handleRent = (vehicleId: string) => {
    router.push(`/bookCar?id=${encodeURIComponent(vehicleId)}`);
    console.log(`Rent car with ID: ${vehicleId}`);
  };

  return (
    <div>
      {/* Search and Price Filter Fields */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search vehicles..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className={styles.priceFilter}>
          {/* Price Filter Dropdown */}
          <select
          value={selectedPriceRange.label}
          onChange={(e) => {
            const selected = priceRanges.find(range => range.label === e.target.value) || priceRanges[0];
            setSelectedPriceRange(selected);
            setIsFiltering(true); 
          }}
          className={styles.searchInput}
        >
          {priceRanges.map(range => (
            <option key={range.label} value={range.label}>
              {range.label}
            </option>
          ))}
        </select>
        </div>
      </div>

      {/* Vehicle Cards */}
      <div className={styles.vehicleContainer}>
        {vehicles?.length ? (
          vehicles.map((vehicle: Vehicle) => (
            <div key={vehicle.id} className={styles.vehicleCard}>
              {vehicle.primaryimage?.images && vehicle.primaryimage.images.length > 0 ? (
                <Image
                  src={vehicle.primaryimage.images} 
                  alt={vehicle.name}
                  className={styles.vehicleImage}
                  width={200}
                  height={200}
                />
              ) : vehicle.primaryImage ? ( 
                <Image
                  src={vehicle.primaryImage} 
                  alt={vehicle.name}
                  className={styles.vehicleImage}
                  width={200}
                  height={200}
                />
              ) : (
                <p>No Image Available</p> // Fallback if no images are found
              )}
              <h2 className={styles.vehicleName}>{vehicle.name}</h2>
              <p className={styles.vehiclePrice}>Price: {vehicle.price}</p>
              <p className={styles.vehicleQuantity}>Quantity: {vehicle.quantity}</p>
              <div className={styles.features}>
                <p className={styles.vehicleSeatCapacity}>
                  <Image src={seat} alt="seat" width={20} height={20} className={styles.searchIcon} /> {vehicle.seats}
                </p>
                <p className={styles.vehicleFuelType}>
                  <Image src={fuel} alt="fuel" width={20} height={20} className={styles.searchIcon} /> {vehicle.fuel}
                </p>
                <p className={styles.vehicleGearType}>
                  <Image src={gear} alt="gear" width={20} height={20} className={styles.searchIcon} /> {vehicle.gear}
                </p>
              </div>
              <div className={styles.actions}>
                <CustomButton type="submit" className={styles.rentButton} onClick={() => handleRent(vehicle.id)}>
                  Rent Car
                </CustomButton>
              </div>
            </div>
          ))
        ) : (
          <p>No vehicles found matching</p>
        )}
      </div>
    </div>
  );
};

export default VehicleCards;
