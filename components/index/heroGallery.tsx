import React, { useRef, useState, useLayoutEffect, useCallback } from "react"
import styles from "../../styles/Home.module.css"
import { useRouter } from 'next/router';
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';
import { useEffect } from 'react';
import { AdvancedImage  } from '@cloudinary/react';

import PageTransition from "../common/PageTransition";
const cld = new Cloudinary({ cloud: { cloudName: 'ddlip2prr' } });

import {
  motion,
} from "framer-motion"


interface Photo {
  image: CloudinaryImage;
  folder: string;
}

const HeroGallery = () => {

  const cld = new Cloudinary({ cloud: { cloudName: 'ddlip2prr' } });

  const [photos, setPhotos] = useState<Photo[]>([]);
  const router = useRouter();

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

  const leftColumn = photos.filter((_, index) => index % 2 === 0);
  const rightColumn = photos.filter((_, index) => index % 2 !== 0);
  const columns = [leftColumn, rightColumn]

  return (
    <div style={{height: '100vh'}}>
        <PageTransition>
          <div style={{ display: 'flex', justifyContent: 'center'}}>
            {columns.map((column, columnIndex) =>
              <div key={columnIndex} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {column.map((photo, index) => (
                  <div key={index}
                    style={{ marginBottom: '40px', marginRight: '20px', marginLeft: '20px', transform: `scale(${1.0})` }} >
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
  );

}

export default HeroGallery
