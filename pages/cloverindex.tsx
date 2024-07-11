import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import styles from '../styles/Home.module.css';
import Image from 'next/image';
import GalleryRow from '../components/galleryRow';
import router from 'next/router';
import { useRouter } from 'next/router';
import PageTransition from "../components/PageTransition";

type IndexPageProps = {};
type IndexPageRef = React.ForwardedRef<HTMLDivElement>;

const photos2 = [
  { url: '/ANGUS CLOUD_SNS_CM_9.jpg', description: 'Photo 1' },
  { url: '/ANGUS CLOUD_SNS_CM_7.jpg', description: 'Photo 2' },
  { url: '/ANGUS CLOUD_SNS_CM_5.jpg', description: 'Photo 3' },
];

const photos = [
  { url: '/STUDIO BUDS_CIAN_C2_2.jpg', description: 'Photo 1' },
  { url: '/GQ FITNESS 2022_9.jpg', description: 'Photo 2' },
];

const photos3 = [
  { url: '/GQ FITNESS 2022_9.jpg', description: 'Photo 1' },
];


const photos5 = [
  { url: '/ee mcd 21.jpg', description: 'Photo 1' },
  { url: '/ee mcd 22.jpg', description: 'Photo 1' },
];


const photos4 = [
  { url: '/ee mcd 20.jpg', description: 'Photo 1' },
];


export default function Home(props: IndexPageProps, ref: IndexPageRef) {
  const [clickedImage, setClickedImage] = useState<string | null>(null); // Example clickedImage state

  const controls = useAnimation();
  const [scrollY, setScrollY] = useState(0);
  const [imageOffScreen, setImageOffScreen] = useState(false);

  const router = useRouter();

  const handleClick = (url) => {
    setClickedImage(url);

    const base64ImageUrl = Buffer.from(url).toString('base64');
    
    // Navigate to ImagePage with base64 data URI
    router.push(`/image?src=${base64ImageUrl}`);
  };


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
      // opacity: 1 - scrollY/10000,
      transition: { type: 'linear', ease: 'easeOut', duration: 0 },
    });
  }, [scrollY, controls]);

  return (
    <div>
      {!imageOffScreen && (
        <div style={{ position: 'relative', height: '200vh' }}>
          <motion.div className={styles.fullscreenImage} animate={controls}>
            <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
              <motion.video
                src="/bts.mp4"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  position: 'absolute',
                }}
                transition={{ duration: 0.3 }}
                autoPlay
                loop
                muted
              />
            </div>
          </motion.div>
        </div>
      )}

      <div style={{ position: 'fixed', top: 12, left: 0, right: 0, bottom: 0, overflowY: (imageOffScreen ? 'scroll' : 'hidden') }}>
      <PageTransition ref={ref}>

        <GalleryRow photos={photos} handleClick={handleClick} clickedImage={clickedImage} />
        <GalleryRow photos={photos2} handleClick={handleClick} clickedImage={clickedImage} />
        <GalleryRow photos={photos3} handleClick={handleClick} clickedImage={clickedImage} />
        <GalleryRow photos={photos5} handleClick={handleClick} clickedImage={clickedImage} />
        <GalleryRow photos={photos4} handleClick={handleClick} clickedImage={clickedImage} />

        </PageTransition>
      </div>
    </div>
  );
}
