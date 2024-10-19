import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdvancedImage } from '@cloudinary/react';
import { Photo } from '../types/types';

import styles from '../styles/HeroGallery.module.css'
import ScrollIndicator from './common/ScrollIndicator';
import { useModal } from '../context/ModalContext';

interface HeroGalleryProps {
  photos: Photo[]
}

const preventRightClick = (e: React.MouseEvent) => {
  e.preventDefault();
}

const heightData = [
  [
    // Group 1
    [3, 10, 3, 11, 12],   // Column 1
    [10, 11, 6, 4, 4],    // Column 2
  ],
  [
     // Group 2
    [10, 12, 10, 2, 7],   // Column 1
    [7, 0, 8, 12, 5],     // Column 2
  ],
  [
     // Group 3
    [5, 8, 10, 12, 9],    // Column 1
    [0, 7, 10, 9, 10],    // Column 2
  ],
  [
     // Group 4
    [8, 9, 10, 6, 6],    // Column 1
    [8, 9, 8, 6, 6],     // Column 2
  ],
  [
     // Group 5
    [9, 7, 8, 6, 6],     // Column 1
    [3, 5, 9, 10, 6],    // Column 2
  ],
  [
     // Group 6
    [6, 8, 9, 8, 9],     // Column 1
    [7, 6, 9, 10, 6],    // Column 2
  ],
];

const HeroGallery: React.FC<HeroGalleryProps> = ({ photos }) => {
  
 const { openModal } = useModal();

 const getColumnGroups = () => {
    const groups = [];
    for (let i = 0; i < photos.length; i += 11) {

      const leftColumn: Photo[] = photos.slice(i, i + 5);
      const rightColumn: Photo[] = photos.slice(i + 5, i + 10) 
      const widePhoto = photos[i + 10] ? [photos[i + 10]] : [];

      groups.push({ leftColumn, rightColumn, widePhoto });
    }
    return groups;
  };
  

  return (
    <div className={styles.heroGalleryContainer}>
      <ScrollIndicator/>
      {getColumnGroups().map((group, groupIndex) => (
        <React.Fragment key={`group-${groupIndex}`}>
          <div style={{ display: 'flex', gap: '8px', height: '150vw' }}>

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
                    onClick={() => openModal('gallery', photo.folder)}
                    onContextMenu={preventRightClick} cldImg={photo.image} 
                    style={{ width: 'auto', maxWidth: '70dvw', maxHeight: '30dvw', objectFit: 'cover' }}
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
