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
  filterState: String;
}

const preventRightClick = (e: React.MouseEvent) => {
  e.preventDefault();
}

const HeroGallery: React.FC<HeroGalleryProps> = ({ photos, heightData, groupIndex, filterState }) => {
  
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
      if (photos[j]) {
        if (j % 2 === 0) {
          leftColumn.push(photos[j]);
        } else {
          rightColumn.push(photos[j]);
        }
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

const calculateHeight = (columnLength: number, groupIndex: number) => { // For hero groups
  const isMobile = (windowWidth ?? 1024) <= 768; // Fallback to 1024 for SSR

  const heights: Record<"VIDEO" | "CLOVERPRODUCTION", { mobile: string[]; desktop: string[] }> = {
    VIDEO: { mobile: ['60vw', '65vw', '100vw'], desktop: ['55vw', '65vw', '100vw'] },
    CLOVERPRODUCTION: { mobile: ['65vw', '100vw', '75vw'], desktop: ['55vw', '80vw', '70vw'] },
  };

  return heights[filterState as keyof typeof heights]?.[isMobile ? 'mobile' : 'desktop'][groupIndex] 
    ?? `${columnLength * (isMobile ? 40 : 30)}vw`;
};


const calculateWidth = (groupIndex: number) => { // For wide photos
  const heights: Record<"VIDEO" | "CLOVERPRODUCTION", string[]> = {
    VIDEO: ['50dvw', '50dvw', '50dvw', '30dvw'],
    CLOVERPRODUCTION: ['30dvw', '50dvw', '70dvw', '10dvw'],
  };

  const fallbackWidth = windowWidth ?? 1024; // Default to 1024 if null
  return heights[filterState as keyof typeof heights]?.[groupIndex] ?? 
  `${ fallbackWidth <= 768 ? 70 : 50}vw`;
};

  

  return (
    <div className={styles.heroGalleryContainer}>
      {getColumnGroups().map((group, index) => (
        <React.Fragment key={`group-${groupIndex}`}> 

        {/* Wide photo spanning both columns */}
        {group.widePhoto.length > 0 && (
            <div className={styles.widePhotoContainer} style={{width: calculateWidth(groupIndex)}}>
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
          <div style={{ display: 'flex', gap: '8px', height: calculateHeight(group.leftColumn.length, groupIndex), }}> 

          {/* Left Column */}
          <div className={styles.leftColumnContainer}>
            {group.leftColumn.map((photo, index) => (
              <div className={styles.leftColumnFlex}
                style={{ height: `${heightData[test][0][index]}%` }}
              >
                <AdvancedImage
                  className={styles.clickablePhoto} onClick={() => openModal('gallery', photo.folder)} onContextMenu={preventRightClick}
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
                    className={styles.clickablePhoto} onClick={() => openModal('gallery', photo.folder)} onContextMenu={preventRightClick}
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
