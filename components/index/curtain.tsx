import React, { useEffect } from 'react';
import styles from '../../styles/Home.module.css';
import HeroGallery from '../index/heroGallery';

const CurtainComponent = () => {
  useEffect(() => {
    const handleScroll = () => {
      const mainElement = document.querySelector(`.${styles.main}`);
      const revealMainElement = document.querySelector(`.${styles.revealMain}`);

      if (mainElement && revealMainElement) {
        if (window.scrollY > window.innerHeight - 10) {
          mainElement.classList.add(styles.active);
          revealMainElement.classList.add(styles.activetwo);
        } else {
          mainElement.classList.remove(styles.active);
          revealMainElement.classList.remove(styles.activetwo);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div style={{height: '100vh'}}>
      <div className={styles.curtain}>
        curtain
      </div>
      <div className={styles.revealMain}></div>
      <div className={styles.main}>
        <HeroGallery/>
      </div>
    </div>
  );
};

export default CurtainComponent;
