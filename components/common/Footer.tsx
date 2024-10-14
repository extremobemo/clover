import React from 'react';
import styles from '../../styles/Footer.module.css'; // Import CSS module

const Footer: React.FC = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.footersection}>Section 1</div>
      <div className={styles.footerdivider}></div>
      <div className={styles.footersection}>Section 2</div>
      <div className={styles.footerdivider}></div>
      <div className={styles.footersection}>Section 3</div>
    </div>
  );
};

export default Footer;
