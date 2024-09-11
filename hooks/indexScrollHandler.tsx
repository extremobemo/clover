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
      if (scrollPosition > threshold && !sessionStorage.getItem('imageOffScreen')) {
        setImageOffScreen(true);
        sessionStorage.setItem('imageOffScreen', JSON.stringify(true));
        window.scrollTo(0, 0); // Reset scroll position
        window.scrollTo(0, 1); // Scroll down to reset safari nav bar
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
