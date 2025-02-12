import CloverEffect from '../components/letters';
import React, { useState, useEffect } from 'react';
import styles from '../styles/Curtain.module.css';
import { useAppContext } from '../context/AppContext';

interface CurtainProps  {
  imageOffScreen : boolean,
  setImageOffScreen : (value: boolean) => void, 
};

const Curtain : React.FC<CurtainProps> = ({ imageOffScreen, setImageOffScreen }) => {
  const {setMenuVisibility} = useAppContext();

  useEffect(() => {
    const curtain = document.getElementById('curtain');

    const savedImageOffScreen = sessionStorage.getItem('imageOffScreen');

    if (savedImageOffScreen) {
      setImageOffScreen(JSON.parse(savedImageOffScreen));
      //if we're not showing curtain, menus should start in hidden state
      setMenuVisibility(false);
    }
  
    const handleScroll = () => {
      const scrollPosition = curtain?.scrollTop;
      const threshold = document.documentElement.clientHeight - 1;
      console.log(scrollPosition)
      if (scrollPosition && scrollPosition > threshold && !sessionStorage.getItem('imageOffScreen')) {
        setImageOffScreen(true);
        sessionStorage.setItem('imageOffScreen', JSON.stringify(true));
        //hide menus once curtain is all the way up
        setMenuVisibility(false);
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
          alt="BTS"
          style={{ width: '100%', height: '100dvh' }}
        />
        
        {/* "O" is now positioned in the center on top of everything */}
        <img className={styles.letterO} src="/o.webp" alt="O" />
  
        <div className={styles.chevron}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12 15.5a1 1 0 0 1-.707-.293l-5-5a1 1 0 0 1 1.414-1.414L12 13.086l4.293-4.293a1 1 0 0 1 1.414 1.414l-5 5A1 1 0 0 1 12 15.5z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );  
};

export default Curtain;