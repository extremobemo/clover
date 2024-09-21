import CloverEffect from '../components/letters';
import React, { useState, useEffect } from 'react';
import styles from '../styles/Curtain.module.css';

const Curtain = ({ imageOffScreen, setImageOffScreen, setShowGreenBar }) => {
  
  useEffect(() => {
    const curtain = document.getElementById('curtain');

    const savedImageOffScreen = sessionStorage.getItem('imageOffScreen');

    if (savedImageOffScreen) {
      setImageOffScreen(JSON.parse(savedImageOffScreen));
      setShowGreenBar(true)
    }
  
    const handleScroll = () => {
      const scrollPosition = curtain.scrollTop;
      const threshold = document.documentElement.clientHeight - 1;
      console.log(scrollPosition)
      if (scrollPosition > threshold && !sessionStorage.getItem('imageOffScreen')) {
        setImageOffScreen(true);
        sessionStorage.setItem('imageOffScreen', JSON.stringify(true));
        setTimeout(() => {
          setShowGreenBar(true);
        }, 100);
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
  }, [setImageOffScreen, setShowGreenBar]);

  if (imageOffScreen) return null; // Do nothing if image is off-screen

  return (
    <div id="curtain" className={styles.curtain}>
      <CloverEffect />
      <div id="video_div" className={styles.videoDiv}>
        <video
            className={styles.fullscreenImage}
            src="/bts.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
    </div>
  );
};

export default Curtain;