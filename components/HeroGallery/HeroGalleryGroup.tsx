import React, { useState, useEffect } from 'react';
import { AdvancedImage, lazyload } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { GalleryGroup } from '../../types/types';

import styles from '../../styles/HeroGallery.module.css'
import { useAppContext } from '../../context/AppContext';
import { auto } from '@cloudinary/url-gen/actions/resize';

interface HeroGalleryProps {
  group: GalleryGroup;
  filterState: string;
  groupIndex: number;
}

const preventRightClick = (e: React.MouseEvent) => {
  e.preventDefault();
}
const HeroGallery: React.FC<HeroGalleryProps> = ({ group, filterState, groupIndex}) => {

  const cld = new Cloudinary({ cloud: { cloudName: 'ddlip2prr' } });
  
 const { openModal } = useAppContext();
 const [windowWidth, setWindowWidth] = useState<number | null>(null);

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
    CLOVERPRODUCTION: ['30dvw', '50dvw', '70dvw', '60dvw'],
  };

  const fallbackWidth = windowWidth ?? 1024; // Default to 1024 if null
  return heights[filterState as keyof typeof heights]?.[groupIndex] ?? 
  `${ fallbackWidth <= 768 ? 70 : 50}vw`;
};

  

const generateUrl = (publicId : string ) => {
  return publicId.includes('_GIF')
              ? cld.image(publicId).resize(auto())
              : cld.image(publicId).resize(auto().width(1000));
}
  
  return (
    <div className={styles.heroGalleryContainer}>
      
        <React.Fragment key={`group-${group}`}> 

        {/* Wide photo spanning both columns */}
        {group.widePhoto  && (
            <div className={styles.widePhotoContainer} style={{width: calculateWidth(groupIndex)}}>
                <div style={{ width: '100%', paddingTop: '4px' }}>
                  <AdvancedImage 
                    onClick={() => openModal('gallery', group.widePhoto.folderName)}
                    onContextMenu={preventRightClick} cldImg={generateUrl(group.widePhoto.publicId)} 
                    className={styles.widePhoto}
                  />
                </div>
            </div>
          )}
          
       {/* VARYING HEIGHT OF COLUMNS BASED ON NUMBER OF PHOTOS IN THE COLUMN
        if there are 5 photos, height stays the same, */}
          <div style={{ display: 'flex', gap: '8px', height: calculateHeight(group.leftColumn.length, groupIndex), }}> 

          {/* Left Column */}
          <div className={styles.leftColumnContainer}>
            {group.leftColumn.map((photo, index) => (
              <div className={styles.leftColumnFlex}
                style={{ height: `${group.leftColumnHeights[index]}%` }}
              >
                <AdvancedImage
                  onClick={() => openModal('gallery', photo.folderName)} onContextMenu={preventRightClick}
                  cldImg={generateUrl(photo.publicId)} style={{ objectFit: 'contain', objectPosition: 'right' }}
                />
              </div>
            ))}
          </div>

          {/* Right Column */}
            <div className={styles.rightColumnContainer}>
              {group.rightColumn.map((photo, index) => (
                <div className={styles.rightColumnFlex}
                 style={{ height: `${group.rightColumnHeights[index]}%` }}
                >
                  <AdvancedImage
                    onClick={() => openModal('gallery', photo.folderName)} onContextMenu={preventRightClick}
                    cldImg={generateUrl(photo.publicId)} style={{ objectFit: 'contain',  objectPosition: 'left'  }}
                    plugins={[lazyload({rootMargin: '10px 20px 10px 30px', threshold: 0.25})]}
                  />
                </div>
              ))}
          </div>
        </div>
        </React.Fragment>
    </div>
  );
};

export default HeroGallery;
