import React, { useState, useEffect, ForwardedRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';
import PageTransition from "../components/common/PageTransition";
import { AdvancedImage  } from '@cloudinary/react';
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import GreenBar from '../components/common/bar';
import { quality } from '@cloudinary/url-gen/actions/delivery';
import { indexScrollHandler } from '../hooks/indexScrollHandler';

interface GalleryPageProps { }

interface Photo {
  image: CloudinaryImage;
  folder: string;
}

const GalleryPage: React.FC<GalleryPageProps> = React.forwardRef((props, ref: ForwardedRef<HTMLDivElement>) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const controls = useAnimation();
  const [scrollY, setScrollY] = useState(0);
  const [imageOffScreen, setImageOffScreen] = useState(false);
  const router = useRouter();
  const [scaleFactor, setScaleFactor] = useState(1.0);
  const [showGreenBar, setShowGreenBar] = useState(false); // State to track green bar visibility

  const cld = new Cloudinary({ cloud: { cloudName: 'ddlip2prr' } });

  indexScrollHandler(setImageOffScreen, setShowGreenBar, setScrollY, setScaleFactor);

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
          const cloudImage = cld.image(photo.public_id)
            .format('auto')
            .quality('auto')
            .resize(auto().gravity(autoGravity()).width(500));

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
    console.log("fetching photos!")
    fetchPhotos();
  }, []);

  useEffect(() => {
    const threshold = window.innerHeight;
    if (!sessionStorage.getItem('imageOffScreen')) {
      const scaleStart = 0.5;
      const scaleEnd = 1.0;
      const scaleRange = scaleEnd - scaleStart;
      let newScaleFactor = (scrollY / threshold) * scaleRange + scaleStart;
      newScaleFactor = Math.min(Math.max(newScaleFactor, scaleStart), scaleEnd);
      setScaleFactor(newScaleFactor);
      sessionStorage.setItem('scaleFactor', JSON.stringify(newScaleFactor));
    }

    controls.start({
      y: -scrollY,
      transition: { type: 'linear', ease: 'easeOut', duration: 0 },
    });
  }, [scrollY, controls]);

  const leftColumn = photos.filter((_, index) => index % 2 === 0);
  const rightColumn = photos.filter((_, index) => index % 2 !== 0);
  const columns = [leftColumn, rightColumn]

  return (
    <div>
      {!imageOffScreen && (
        <div style={{ position: 'relative', height: '200vh' }}>
            <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
              <video className={styles.fullscreenImage}
                src="/bts.mp4"
                style={{ width: '100%', height: '100%', objectFit: 'cover',position: 'absolute'}}
                // transition={{ duration: 0.3 }}
                autoPlay loop muted
              />
            </div>
        </div>
      )}
       {/* {showGreenBar && (<GreenBar text="CLOVER." />)} */}
      <div style={{ position: 'static', top: 12, left: 0, right: 0}}>
        <PageTransition>
          <div style={{ display: 'flex', justifyContent: 'center'}}>
            {columns.map((column, columnIndex) =>
              <div key={columnIndex} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {column.map((photo, index) => (
                  <div key={index}
                    style={{ marginBottom: '40px', marginRight: '20px', marginLeft: '20px', transform: `scale(${scaleFactor})` }} >
                    <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
                      <AdvancedImage cldImg={photo.image.delivery(quality("auto"))} className="advanced-image"
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
});

export default GalleryPage;
