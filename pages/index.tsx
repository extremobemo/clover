import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';
import PageTransition from "../components/common/PageTransition";
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import GreenBar from '../components/common/bar';
import { indexScrollHandler } from '../hooks/indexScrollHandler';

interface Photo {
  image: CloudinaryImage;
  folder: string;
}

const HeroPage: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [scrollY, setScrollY] = useState(0);
  const [imageOffScreen, setImageOffScreen] = useState(false);
  const router = useRouter();
  const [showGreenBar, setShowGreenBar] = useState(false); // State to track green bar visibility

  const cld = new Cloudinary({ cloud: { cloudName: 'ddlip2prr' } });

  indexScrollHandler(setImageOffScreen, setShowGreenBar, setScrollY);

  const handleClick = (folderName: string) => {
    router.push(`/gallery?public_id=${folderName}`);
  };

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

  const leftColumn = photos.filter((_, index) => index % 2 === 0);
  const rightColumn = photos.filter((_, index) => index % 2 !== 0);
  const columns = [leftColumn, rightColumn]

  return (
    <div>
      {!imageOffScreen && (
        <div className='relative' style={{ height: '200vh' }}>
          <div className='w-screen h-screen relative'>
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

      {showGreenBar && (<GreenBar text="CLOVER." />)}

      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, overflowY: 'scroll', overscrollBehavior: 'contain', height: `-webkit-fill-available`, WebkitOverflowScrolling: 'touch' }}>
        <PageTransition>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {columns.map((column, columnIndex) =>
              <div key={columnIndex} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {column.map((photo, index) => (
                  <div key={index}
                    style={{ marginBottom: '40px', marginRight: '20px', marginLeft: '20px' }} >
                    <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
                      <AdvancedImage cldImg={photo.image} className="advanced-image"
                        style={{ width: '100%' }} transition={{ duration: 0.3 }}
                        onClick={() => handleClick(photo.folder)} />
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
