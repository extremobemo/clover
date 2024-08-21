import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';
import PageTransition from "../components/common/PageTransition";
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import GreenBar from '../components/common/bar';
import { indexScrollHandler } from '../hooks/indexScrollHandler';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

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

  // Ref for the video section
  const videoSectionRef = useRef<HTMLDivElement>(null);

  indexScrollHandler(setImageOffScreen, setShowGreenBar, setScrollY);

  const handleClick = (folderName: string) => {
    router.push(`/gallery?public_id=${folderName}`);
  };

  // Handle scroll locking and unlocking based on imageOffScreen state
  useEffect(() => {
    if (!imageOffScreen && videoSectionRef.current) {
      // Disable body scroll while the image is on screen
      disableBodyScroll(videoSectionRef.current, { reserveScrollBarGap: false });
      console.log("DISABLED")
    } else if (imageOffScreen) {
      // Re-enable body scroll when the image goes off screen
      // enableBodyScroll(videoSectionRef.current);
      console.log(imageOffScreen)
      
      // Optionally hide the video container once it's off-screen
      if (videoSectionRef.current) {
        // videoSectionRef.current.style.display = 'none';
      }
    }

    return () => {
      clearAllBodyScrollLocks(); // Clear scroll locks when component unmounts
    };
  }, [imageOffScreen]); // Re-run effect when imageOffScreen changes

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
    const handleScroll = () => {
      if (videoSectionRef.current) {
        const rect = videoSectionRef.current.getBoundingClientRect();
        console.log(rect.bottom)
        // Check if the element is off the screen
        if (rect.bottom <= window.innerHeight + 200) {
          setImageOffScreen(true);
        } else {
          setImageOffScreen(false);
        }
      } else {
        console.log("no ref")
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const leftColumn = photos.filter((_, index) => index % 2 === 0);
  const rightColumn = photos.filter((_, index) => index % 2 !== 0);
  const columns = [leftColumn, rightColumn];

  return (
    <div style={{ overflow: 'hidden' }}> {/* Lock body scroll */}
            {!imageOffScreen && (
        <div
          ref={videoSectionRef}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100vh', overflowY: 'scroll', zIndex: 1 }}
        >
          <div style={{ height: '200vh' }}>
            <video
              className={styles.fullscreenImage}
              src="/bts.mp4"
              style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute' }}
              autoPlay
              loop
              muted
            />
          </div>
        </div>
            )}


      {/* The rest of the content should remain locked and not scroll */}
      <div style={{ position: 'relative', top: 0, bottom: 0, height: 5000 }}>
        <PageTransition>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {columns.map((column, columnIndex) => (
              <div key={columnIndex} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {column.map((photo, index) => (
                  <div key={index} style={{ marginBottom: '40px', marginRight: '20px', marginLeft: '20px' }}>
                    <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
                      <AdvancedImage
                        cldImg={photo.image}
                        className="advanced-image"
                        style={{ width: '100%' }}
                        onClick={() => handleClick(photo.folder)}
                      />
                    </motion.div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </PageTransition>
      </div>
    </div>
  );
};

export default HeroPage;
