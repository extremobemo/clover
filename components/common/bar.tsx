// components/GreenBar.tsx
import React from 'react';
import styles from '../../styles/Home.module.css';
import Footer from './footerbutton'

interface BarProps {
  text: string;
}

const GreenBar: React.FC<BarProps> = ({ text }) => {
  return (
    <div className={`${styles.greenBar} ${styles.greenBarVisible}`}>
      <Footer />
    </div>
  );
};

export default GreenBar;