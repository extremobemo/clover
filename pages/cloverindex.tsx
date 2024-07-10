import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import styles from '../styles/Home.module.css';
import Image from 'next/image';
import GalleryRow from '../components/galleryRow';

const photos = [
  { url: '/chickenrun.webp', description: 'Photo 1' },
  { url: '/ninja.jpg', description: 'Photo 2' },
  { url: '/Ninja.webp', description: 'Photo 3' },
];

const photos2 = [
  { url: '/adam.webp', description: 'Photo 1' },
  { url: '/ninja.jpg', description: 'Photo 2' },
];

export default function Home() {
  const controls = useAnimation();
  const [scrollY, setScrollY] = useState(0);
  const [imageOffScreen, setImageOffScreen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrollY(scrollPosition);

      // Adjust this threshold to determine when the image is completely off-screen
      const threshold = window.innerHeight; // Example threshold, adjust as needed
      if (scrollPosition > threshold) {
        setImageOffScreen(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll); // Clean up the event listener
    };
  }, []);

  useEffect(() => {
    controls.start({
      y: -scrollY,
      transition: { type: 'linear', ease: 'easeOut', duration: 0 },
    });
  }, [scrollY, controls]);

  return (
    <div>
      {!imageOffScreen && ( 
        <div style= {{ position: 'relative', height: '200vh' }}>
            <motion.div className={styles.fullscreenImage} animate={controls}>
              <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
                <Image src="/gif.gif" layout="fill" objectFit="cover" alt="Your alt text" />
              </div>
            </motion.div>
        </div> 
      )}

      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, overflowY: (imageOffScreen ? 'scroll' :'hidden') }}>
        <GalleryRow photos={photos} />
        <GalleryRow photos={photos2} />
        <GalleryRow photos={photos} />
        <GalleryRow photos={photos2} />
      </div>
    </div>
  );
}
