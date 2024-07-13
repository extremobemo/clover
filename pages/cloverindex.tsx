import React, { useState, useEffect, ForwardedRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';
import PageTransition from "../components/PageTransition";
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import GreenBar from '../components/bar';

interface GalleryPageProps { }

const GalleryPage: React.FC<GalleryPageProps> = React.forwardRef((props, ref: ForwardedRef<HTMLDivElement>) => {
  const [clickedImage, setClickedImage] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Cloudinary[]>([]);
  const controls = useAnimation();
  const [scrollY, setScrollY] = useState(0);
  const [imageOffScreen, setImageOffScreen] = useState(false);
  const router = useRouter();
  const [scaleFactor, setScaleFactor] = useState(1.0);
  const [hoveredIndex, setHoveredIndex] = useState(null); // State to track hovered index
  const [showGreenBar, setShowGreenBar] = useState(false); // State to track green bar visibility

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };


  const cld = new Cloudinary({ cloud: { cloudName: 'ddlip2prr' } });

  const handleClick = (cloudImage) => {
    console.log(cloudImage)
    router.push(`/image?public_id=${cloudImage.publicID}`);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrollY(scrollPosition);
      const threshold = window.innerHeight;
      if (scrollPosition > threshold) {
        setImageOffScreen(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch('/api/photos');
        const data = await response.json();
        const cloudinaryImages = data.map((photo: any) => (
          cld.image(photo.public_id)
            .format('auto')
            .quality('auto')
            .resize(auto().gravity(autoGravity()).width(500))
        ));
        setPhotos(cloudinaryImages);
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    };

    fetchPhotos();
  }, []);

  useEffect(() => {
    const threshold = window.innerHeight;
    if (!imageOffScreen) {
      const scaleStart = 0.5;
      const scaleEnd = 1.0;
      const scaleRange = scaleEnd - scaleStart;
      let newScaleFactor = (scrollY / threshold) * scaleRange + scaleStart;
      newScaleFactor = Math.min(Math.max(newScaleFactor, scaleStart), scaleEnd);
      setScaleFactor(newScaleFactor);
    }

    const blurAmount = Math.min((scrollY / threshold) * 5, 5);
    controls.start({
      // filter: `blur(${blurAmount}px)`,
      y: -scrollY,
      transition: { type: 'linear', ease: 'easeOut', duration: 0 },
    });

    if (imageOffScreen) {
      
      setTimeout(() => {
        setShowGreenBar(true);
      }, 100); // Adjust the delay as needed
     
    }
  }, [scrollY, controls]);


  const leftColumn = photos.filter((_, index) => index % 2 === 0);
  const rightColumn = photos.filter((_, index) => index % 2 !== 0);
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

      {showGreenBar && (
        <GreenBar text="CLOVER." />
      )}
      
      <div style={{ position: 'fixed', top: 12, left: 0, right: 0, bottom: 0, overflowY: imageOffScreen ? 'scroll' : 'hidden' }}>
      <PageTransition ref={ref}>
         
         <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
           {leftColumn.map((img, index) => (
             <div key={index} onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave}
             style={{ marginBottom: '20px', transform: `scale(${scaleFactor})` }} >
              <motion.div whileHover={{scale: 1.1}} transition={{ duration: 0.3 }}>
               <AdvancedImage cldImg={img} className="advanced-image" 
               style={{ width: '100%' }} transition={{ duration: 0.3 }}
               onClick={() => handleClick(img)} />
               </motion.div>
             </div>
           ))}
         </div>
         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
           {rightColumn.map((img, index) => (
             <div key={index} onMouseEnter={() => handleMouseEnter(index + leftColumn.length)} onMouseLeave={handleMouseLeave} 
             style={{ marginBottom: '20px', transform: `scale(${ scaleFactor})` }}>
               <motion.div whileHover={{scale: 1.1}} transition={{ duration: 0.3 }}>
               <AdvancedImage cldImg={img} className="advanced-image"
                style={{ width: '100%' }}  transition={{ duration: 0.3 }}
                onClick={() => handleClick(img)} />
               </motion.div>
             </div>
           ))}
         </div>
       </div>

    </PageTransition>
      </div>
    </div>
  );
});

export default GalleryPage;
