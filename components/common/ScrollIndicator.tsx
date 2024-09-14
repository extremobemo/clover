import React, { useState, useEffect } from 'react';
import styles from '../../styles/Home.module.css';
import Footer from './footer';

interface BarProps {
  text: string;
}

const ScrollIndicator: React.FC<BarProps> = ({ text }) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  const updateScrollProgress = () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;

    const scrollPercentage = Math.min((scrollTop / documentHeight) * 100, 100);
    setScrollProgress(scrollPercentage);
  };

  useEffect(() => {
    const handleScroll = () => updateScrollProgress();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className={styles.greenBar}
      style={{
        width: `${scrollProgress}%`,
        transition: 'width linear', 
      }}
    >
      <Footer />
    </div>
  );
};

export default ScrollIndicator;
