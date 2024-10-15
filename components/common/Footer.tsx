import React from 'react';
import styles from '../../styles/Footer.module.css'; // Adjust according to your structure

const Footer: React.FC = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.section}>
        <p>CLOVER</p>
      </div>
      <div className={styles.divider}></div>
      <div className={styles.section}>
        <p>PRODUCTIONS</p>
      </div>
      <div className={styles.divider}></div>
      <div className={styles.section}>
        <p>MENU</p>
      </div>
    </div>
  );
};

export default Footer;
