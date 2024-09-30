import React, { useState } from "react"
import styles from "../../styles/Home.module.css"
import Footer from '../common/footer'

import { useRouter } from 'next/router';
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { useEffect} from 'react';
import ReactDom from 'react-dom';

import PageTransition from "../common/PageTransition";
const cld = new Cloudinary({ cloud: { cloudName: 'ddlip2prr' } });

import {
  motion,
} from "framer-motion"

interface HorizontalGalleryProps {
  public_id : string | null
}

const HorizontalGallery : React.FC<HorizontalGalleryProps> = ( {public_id}) => {

  var expectedPhotos = 3;
  if (public_id) {
    // Read # of expected photos from folder name
    expectedPhotos = parseInt((public_id as string).split('-')[1], 10);
  }

  const [photos, setPhotos] = useState<CloudinaryImage[]>([]);

  useEffect(() => {

    if (typeof public_id !== 'string') return;
    const folder = public_id;
    console.log(folder)
    fetch(`/api/projectphotos?folder=${folder}`)
      .then(response => response.json())
      .then(data => {
        const cloudinaryImages = data.map((photo: any) =>
          cld.image(photo.public_id).format('auto').quality('auto').resize(auto().gravity(autoGravity()).width(500))
        );
        setPhotos(cloudinaryImages);
      })
      .catch(error => console.error('Error:', error));
  }, [public_id, cld]);

  useEffect(() => {
    const handleScroll = (e : WheelEvent) => {
        // Check if scrolling vertically
        if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
            const scrollContainer = document.getElementById("scroll-container");
            if (scrollContainer) {
                scrollContainer.scrollLeft += e.deltaY;
            }
        }
    };

    window.addEventListener("wheel", handleScroll);

    return () => {
        window.removeEventListener("wheel", handleScroll);
    };
}, []);

  return  (
    <>
      <div style={{ overflowY: 'hidden', overflowX: 'scroll', height: '100dvh'}} id="scroll-container">
        <PageTransition>
          <motion.section className={styles.thumbnailscontainer}>

            <div className={styles.thumbnails}>
              {photos.map((photo, index) => (
                <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }} style={{placeContent: 'center'}}>
                  <div className={styles.thumbnail} key={index}>
                    <AdvancedImage cldImg={photo} style={{ maxHeight: '70vh', maxWidth: '70vw' }} />
                  </div>
                </motion.div>
              ))}

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

export default HorizontalGallery
