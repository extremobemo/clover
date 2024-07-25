import React, { useEffect, useState } from 'react';
import styles from '../../styles/Home.module.css';
import HeroGallery from '../index/heroGallery';

const CurtainComponent = () => {
        const [isCurtainVisible, setIsCurtainVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const mainElement = document.querySelector(`.${styles.main}`);
      const revealMainElement = document.querySelector(`.${styles.revealMain}`);

      if (isCurtainVisible) {
        if (window.scrollY > window.innerHeight - 1) {
          mainElement.classList.add(styles.active);
          revealMainElement.classList.add(styles.activetwo);
          setIsCurtainVisible(false);
        } else {
          // mainElement.classList.remove(styles.active);
          // revealMainElement.classList.remove(styles.activetwo);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isCurtainVisible]);

  return (
    <div>
      {isCurtainVisible && (
        <div className={styles.curtain}>
          curtain
        </div>
      )}
      
      <div className={styles.revealMain}/>

      <div className={ isCurtainVisible ? styles.main : styles.main}>
        <HeroGallery/>
      </div>

    </div>
  );
};

export default CurtainComponent;
