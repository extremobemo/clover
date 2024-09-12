import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';
import PageTransition from "../components/common/PageTransition";
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import GreenBar from '../components/common/bar';
import Link from 'next/link';

interface Photo {
  image: CloudinaryImage;
  folder: string;
}

const HeroPage: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [scrollY, setScrollY] = useState(0);
  const [imageOffScreen, setImageOffScreen] = useState(false);
  const router = useRouter();
  const [showGreenBar, setShowGreenBar] = useState(false);
  const cld = new Cloudinary({ cloud: { cloudName: 'ddlip2prr' } });

  // indexScrollHandler(setImageOffScreen, setShowGreenBar, setScrollY);

  // Fetch Hero Photos
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch('/api/photos');
        const data = await response.json();

        const cloudinaryPhotos = data.map((photo: any) => {
          const cloudImage = cld.image(photo.public_id).resize(auto().width(500));
          return {
            image: cloudImage,
            folder: photo.folder,
          };
        });
        setPhotos(cloudinaryPhotos);
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    };

    fetchPhotos();
  }, []);

  useEffect(() => {
    const curtain = document.getElementById('curtain');

    const savedImageOffScreen = sessionStorage.getItem('imageOffScreen');
    if (savedImageOffScreen) {
      setImageOffScreen(JSON.parse(savedImageOffScreen));
      setShowGreenBar(true)
    }
  
    const handleScroll = () => {
      const scrollPosition = curtain.scrollTop;
      setScrollY(scrollPosition);
      const threshold = document.documentElement.clientHeight - 1;
      console.log(scrollPosition)
      if (scrollPosition > threshold && !sessionStorage.getItem('imageOffScreen')) {
        setImageOffScreen(true);
        sessionStorage.setItem('imageOffScreen', JSON.stringify(true));
        // window.scrollTo(0, 0); // Reset scroll position
        // window.scrollTo(0, 1); // Scroll down to reset safari nav bar
        setTimeout(() => {
          setShowGreenBar(true);
        }, 100);
      }
    };
  
    if (curtain) {
      curtain.addEventListener('scroll', handleScroll);
    }
  
    return () => {
      if (curtain) {
        curtain.removeEventListener('scroll', handleScroll);
      }
    };
  }, [setImageOffScreen, setShowGreenBar]);


  const leftColumn = photos.filter((_, index) => index % 2 === 0);
  const rightColumn = photos.filter((_, index) => index % 2 !== 0);
  const columns = [leftColumn, rightColumn]

  return (
    <div style={{overflowY: 'hidden', height: '100vh'}}>

      {!imageOffScreen && (
        <div id="curtain" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '100vh',
          zIndex: 10,
          overflow: 'auto',
          backgroundColor: 'clear'
        }}>
          <div style={{
            height: '200dvh',
            width: '100dvw',
            //transform: `translateY(-${scrollY}px) translateZ(0)`,
            willChange: 'transform'
          }}>
            <video
              className={styles.fullscreenImage}
              src="/bts.mp4"
              // style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute' }}
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        </div>
      )}

      {showGreenBar && (<GreenBar text="CLOVER." />)}

     <div style={{
      // position: 'absolute',
        position: imageOffScreen ? 'absolute' : 'fixed',
        zIndex: 1,
        height: '600vh',
        display: 'flex',
        justifyContent: 'center',
        transition: 'top 0.3s ease-out',
        overflowY : 'hidden'
      }}>

        <PageTransition>
          <div style={{ display: 'flex', width: '100vw', justifyContent: 'center'}}>
            {columns.map((column, columnIndex) =>
              <div key={columnIndex} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '40vw' }}>
                {column.map((photo, index) => (
                  <div key={index}
                    style={{ marginBottom: '4px', marginRight: '4px', marginLeft: '4px' }} >
                    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
                      <Link href={`/gallery?public_id=${photo.folder}`} passHref>
                        <AdvancedImage cldImg={photo.image} className="advanced-image"
                          style={{ width: '100%', borderRadius: '4px' }} transition={{ duration: 0.3 }} />
                      </Link>
                    </motion.div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </PageTransition>

      </div>
    </div>
  );
};

export default HeroPage;
