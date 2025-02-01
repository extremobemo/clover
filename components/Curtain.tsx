import CloverEffect from '../components/letters';
import React, { useState, useEffect } from 'react';
import styles from '../styles/Curtain.module.css';

interface CurtainProps  {
  imageOffScreen : boolean,
  setImageOffScreen : (value: boolean) => void, 
};

const Curtain : React.FC<CurtainProps> = ({ imageOffScreen, setImageOffScreen }) => {
  
  useEffect(() => {
    const curtain = document.getElementById('curtain');

    const savedImageOffScreen = sessionStorage.getItem('imageOffScreen');

    if (savedImageOffScreen) {
      setImageOffScreen(JSON.parse(savedImageOffScreen));
    }
  
    const handleScroll = () => {
      const scrollPosition = curtain?.scrollTop;
      const threshold = document.documentElement.clientHeight - 1;
      console.log(scrollPosition)
      if (scrollPosition && scrollPosition > threshold && !sessionStorage.getItem('imageOffScreen')) {
        setImageOffScreen(true);
        sessionStorage.setItem('imageOffScreen', JSON.stringify(true));
      }
    };
  
    if (curtain) {
      curtain.addEventListener('scroll', handleScroll);
    }
  
    return () => {
      if (curtain) {
        curtain.removeEventListener('scroll', handleScroll);
      }
    };
  }, [setImageOffScreen]);

  if (imageOffScreen) return null; // Do nothing if image is off-screen

  return (
    <div id="curtain" className={styles.curtain}>
      <CloverEffect />
      <div id="video_div" className={styles.videoDiv}>
      <img
        className={styles.fullscreenImage}
        src="/bts.jpg"
        alt="BTS" // Provide an alt text for accessibility
        style={{ width: '100%', height: '100dvh' }} // Adjust the styles as needed
      />

        </div>
    </div>
  );
};

export default Curtain;