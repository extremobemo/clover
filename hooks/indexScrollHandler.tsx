// hooks/useScrollHandler.ts

import { useEffect } from 'react';

export const indexScrollHandler = (
  setImageOffScreen: (offScreen: boolean) => void,
  setShowGreenBar: (show: boolean) => void,
  setScrollY: (scrollY: number) => void) => {
  useEffect(() => {
    const savedImageOffScreen = sessionStorage.getItem('imageOffScreen');
    if (savedImageOffScreen) {
      setImageOffScreen(JSON.parse(savedImageOffScreen));
      setShowGreenBar(true)
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrollY(scrollPosition);
      const threshold = window.innerHeight;
      if (scrollPosition > threshold) {
        setImageOffScreen(true);
        sessionStorage.setItem('imageOffScreen', JSON.stringify(true));
        setTimeout(() => {
          setShowGreenBar(true);
        }, 100);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [setImageOffScreen, setShowGreenBar, setScrollY]);
};
