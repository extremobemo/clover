import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdvancedImage, lazyload } from '@cloudinary/react';
import { Photo } from '../../types/types';

import styles from '../../styles/HeroGallery.module.css'
import { useAppContext } from '../../context/AppContext';

interface HeroGalleryProps {
  photos: Photo[],
  heightData: number[][][],
  groupIndex: number;
}

const preventRightClick = (e: React.MouseEvent) => {
  e.preventDefault();
}

const HeroGallery: React.FC<HeroGalleryProps> = ({ photos, heightData, groupIndex }) => {
  
 const { openModal } = useAppContext();
 const [windowWidth, setWindowWidth] = useState<number | null>(null);
 const test = groupIndex

 
 const getColumnGroups = () => {
  const groups = [];
  for (let i = 0; i < photos.length; i += 11) {
    // Manually set the wide photo to be the first in each group
    const leftColumn: Photo[] = [];
    const rightColumn: Photo[] = [];

    // Use the first photo in each group as the wide photo
    const widePhoto = photos[i] ? [photos[i]] : [];

    // Populate columns with the remaining photos
    for (let j = i + 1; j < i + 11; j++) {
      if (j % 2 === 0) {
        photos[j] ? leftColumn.push(photos[j]) : console.log("be careful spongebob");
      } else {
        photos[j] ? rightColumn.push(photos[j]) : console.log("spongebob be careful");
      }
    }

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
  return width <= 768 ? `${columnLength * 40}vw` : `${columnLength * 30}vw`;
  // return `${columnLength * 40}vw`;
};
  

  return (
    <div className={styles.heroGalleryContainer}>
      {getColumnGroups().map((group, groupIndex) => (
        <React.Fragment key={`group-${groupIndex}`}> 

        {/* Wide photo spanning both columns */}
        {group.widePhoto.length > 0 && (
            <div className={styles.widePhotoContainer}>
              {group.widePhoto.map(photo => (
                <div style={{ width: '100%', paddingTop: '4px' }}>
                  <AdvancedImage 
                    onClick={() => openModal('gallery', photo.folder)}
                    onContextMenu={preventRightClick} cldImg={photo.image} 
                    className={styles.widePhoto}
                  />
                </div>
              ))}
            </div>
          )}
          
       {/* VARYING HEIGHT OF COLUMNS BASED ON NUMBER OF PHOTOS IN THE COLUMN
        if there are 5 photos, height stays the same, */}
          <div style={{ display: 'flex', gap: '8px', height: calculateHeight(group.leftColumn.length), }}> 

          {/* Left Column */}
          <div className={styles.leftColumnContainer}>
            {group.leftColumn.map((photo, index) => (
              <div className={styles.leftColumnFlex}
                style={{ height: `${heightData[test][0][index]}%` }}
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
                 style={{ height: `${heightData[test][1][index]}%` }}
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
        </React.Fragment>
      ))}
    </div>
  );
};

export default HeroGallery;
