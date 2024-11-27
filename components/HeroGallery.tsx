import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdvancedImage, lazyload } from '@cloudinary/react';
import { Photo } from '../types/types';

import styles from '../styles/HeroGallery.module.css'
import ScrollIndicator from './common/ScrollIndicator';
import { useAppContext } from '../context/AppContext';

interface HeroGalleryProps {
  photos: Photo[],
  heightData: number[][][],
}

const preventRightClick = (e: React.MouseEvent) => {
  e.preventDefault();
}

const HeroGallery: React.FC<HeroGalleryProps> = ({ photos, heightData }) => {
  
 const { openModal } = useAppContext();
 const [windowWidth, setWindowWidth] = useState<number | null>(null);
 
 
 const getColumnGroups = () => {
  const groups = [];
  for (let i = 0; i < photos.length; i += 11) { 
    //for indices i thru i+10 alternate placing photos in first and second column.
    //for index i+11, make the wide boy 
    const leftColumn : Photo[] = [];
    const rightColumn: Photo[] = [];
    for(let j = i; j < i + 10; j++) {
      if(j%2 == 0)
        photos[j] ? leftColumn.push(photos[j]) : console.log("be careful spongebob");
      else
        photos[j] ? rightColumn.push(photos[j]) : console.log("spongebob be careful")
    }

    const widePhoto = photos[i + 10] ? [photos[i + 10]] : [];

    groups.push({ leftColumn, rightColumn, widePhoto });
  }
  return groups;
};

useEffect(() => {
  // Set window width only on the client
  setWindowWidth(window.innerWidth);

  const handleResize = () => setWindowWidth(window.innerWidth);
  window.addEventListener('resize', handleResize);

  return () => window.removeEventListener('resize', handleResize);
}, []);

const calculateHeight = (columnLength: number) => {
  // Fallback height if windowWidth is not yet available
  const width = windowWidth || 1024; // Default width for SSR
  return width <= 768 ? `${columnLength * 45}vw` : `${columnLength * 30}vw`;
};
  

  return (
    <div className={styles.heroGalleryContainer}>
      <ScrollIndicator/>
      {getColumnGroups().map((group, groupIndex) => (
        <React.Fragment key={`group-${groupIndex}`}> 
       {/* VARYING HEIGHT OF COLUMNS BASED ON NUMBER OF PHOTOS IN THE COLUMN
        if there are 5 photos, height stays the same, */}
          <div style={{ display: 'flex', gap: '8px', height: calculateHeight(group.leftColumn.length), }}> 

          {/* Left Column */}
          <div className={styles.leftColumnContainer}>
            {group.leftColumn.map((photo, index) => (
              <div className={styles.leftColumnFlex}
                style={{ height: `${heightData[groupIndex][0][index]}%` }}
              >
                <AdvancedImage
                  onClick={() => openModal('gallery', photo.folder)} onContextMenu={preventRightClick}
                  cldImg={photo.image} style={{ objectFit: 'contain', objectPosition: 'right' }}
                />
              </div>
            ))}
          </div>

          {/* Right Column */}
            <div className={styles.rightColumnContainer}>
              {group.rightColumn.map((photo, index) => (
                <div className={styles.rightColumnFlex}
                 style={{ height: `${heightData[groupIndex][1][index]}%` }}
                >
                  <AdvancedImage
                    onClick={() => openModal('gallery', photo.folder)} onContextMenu={preventRightClick}
                    cldImg={photo.image} style={{ objectFit: 'contain',  objectPosition: 'left'  }}
                    plugins={[lazyload({rootMargin: '10px 20px 10px 30px', threshold: 0.25})]}
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Wide photo spanning both columns */}
          {group.widePhoto.length > 0 && (
            <div className={styles.widePhotoContainer}>
              {group.widePhoto.map(photo => (
                <div style={{ width: '100%', padding: '4px' }}>
                  <AdvancedImage 
                     plugins={[lazyload({rootMargin: '10px 20px 10px 30px', threshold: 0.25})]}
                    onClick={() => openModal('gallery', photo.folder)}
                    onContextMenu={preventRightClick} cldImg={photo.image} 
                    className={styles.widePhoto}
                  />
                </div>
              ))}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default HeroGallery;
