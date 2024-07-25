import React, { useRef, useState, useLayoutEffect, useCallback } from "react"
import ResizeObserver from "resize-observer-polyfill"
import styles from "../../styles/Home.module.css"
import Footer from '../common/footer'

import { useRouter } from 'next/router';
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';
import { useEffect } from 'react';

import PageTransition from "../common/PageTransition";
const cld = new Cloudinary({ cloud: { cloudName: 'ddlip2prr' } });

import {
  motion,
} from "framer-motion"

const SmoothScroll = () => {
  const router = useRouter();
  const { public_id } = router.query;
  var expectedPhotos = 3;
  if (public_id) {
    expectedPhotos = parseInt((public_id as string).split('-')[1], 10);
  }
  const [photos, setPhotos] = useState<CloudinaryImage[]>([]);

  useEffect(() => {
    if (typeof public_id !== 'string') return;

    const folder = public_id; // Adjust folder name as per your needs
    console.log(folder)
    fetch(`/api/projectphotos?folder=${folder}`)
      .then(response => response.json())
      .then(data => {
        const cloudinaryImages = data.map((photo: any) =>
          cld.image(photo.public_id)
        );
        setPhotos(cloudinaryImages);
      })
      .catch(error => console.error('Error:', error));
  }, [public_id, cld]);


  const scrollRef = useRef(null)
  const ghostRef = useRef(null)
  const [scrollRange, setScrollRange] = useState(0)
  const [viewportW, setViewportW] = useState(0)

  useLayoutEffect(() => {
    scrollRef && setScrollRange(scrollRef.current.scrollWidth)
  }, [scrollRef])

  const onResize = useCallback(entries => {
    for (let entry of entries) {
      setViewportW(entry.contentRect.width)
    }
  }, [])

  useLayoutEffect(() => {
    const resizeObserver = new ResizeObserver(entries => onResize(entries))

    return () => resizeObserver.disconnect()
  }, [onResize])

  return (
    <>
      <div className={styles.scrollcontainer}>
        <PageTransition>
          <motion.section
            ref={scrollRef}

            className={styles.thumbnailscontainer}
          >
            <div className={styles.thumbnails}>

              <div className={styles.textContainer}
              style={{maxWidth: '40%'}}>
                <h1>WE THE BEST MUSIC</h1>
                <p>GATORADE! GATORADE! GATORADE! GATORADE! GATORADE! GATORADE! GATORADE! GATORADE! GATORADE! GATORADE! GATORADE! GATORADE!</p>
              </div>

              {photos.map((photo, index) => (
                <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
                  <div className={styles.thumbnail} key={index}>
                    <AdvancedImage cldImg={photo} style={{ height: '70vh' }}/>
                  </div>
                </motion.div>
              ))}

              {/* Render empty placeholders based on how many photos you expect */}
              {Array.from({ length: expectedPhotos - photos.length }, (_, index) => (
                <div className={styles.thumbnail} key={`placeholder-${index}`} />
              ))}

            </div>
          </motion.section>
         
        </PageTransition>
        
      </div>
      <Footer />
    </>
  );

}

export default SmoothScroll
