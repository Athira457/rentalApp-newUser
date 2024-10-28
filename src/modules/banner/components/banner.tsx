// Banner image and available brands display
import React from 'react';
import styles from './banner.module.css'; 
import Image from 'next/image';
import image from '@/themes/images/image.svg';
import toyota from '@/themes/images/toyota.svg';
import ford from '@/themes/images/ford.svg';
import hyundai from '@/themes/images/Hyundai.svg';
import bmw from '@/themes/images/bmw.svg';
import tesla from '@/themes/images/Tesla.svg';

const Banner: React.FC = () => {
  return (
    <div className={styles.banner}>
      {/* Banner Content */}
      <div className={styles.mainContent}>
        <h1 className={styles.title}>Discover the world on wheels<span className={styles.span}> with our car rental service</span></h1>
        <Image src={image} alt="Car" className={styles.carImage} width={800} height={300} />
      </div>

      {/* Form Section shows available brands */}
      <div className={styles.formSection}>
        <div><h3 className={styles.h3}>Available Brands</h3></div>
        <div className={styles.brands}>
          <Image src={toyota} alt='toyota' width={40} height={40} className={styles.img1}/>
          <Image src={ford} alt='ford' width={40} height={40} className={styles.img1}/>
          <Image src={hyundai} alt='hun' width={40} height={40} className={styles.img1}/>
          <Image src={bmw} alt='bmw' width={40} height={40} className={styles.img1}/>
          <Image src={tesla} alt='tesla' width={40} height={40} className={styles.img1}/>
        </div>
      </div>
    </div>
  );
};

export default Banner;
