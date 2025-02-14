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
const HeroGallery: React.FC<HeroGalleryProps> = ({ group, filterState, groupIndex }) => {

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
      VIDEO: { mobile: ['110vw', '65vw', '75vw'], desktop: ['70vw', '65vw', '60vw'] },
      CLOVERPRODUCTION: { mobile: ['120vw', '110vw', '140vw'], desktop: ['75vw', '80vw', '120vw'] },
    };

    return heights[filterState as keyof typeof heights]?.[isMobile ? 'mobile' : 'desktop'][groupIndex]
      ?? `${columnLength * (isMobile ? 40 : 30)}vw`;
  };


  const calculateWidth = (groupIndex: number) => {
    const isMobile = (windowWidth ?? 1024) <= 768; // Fallback to 1024 for SSR

    const widths: Record<"VIDEO" | "CLOVERPRODUCTION", { mobile: string[]; desktop: string[] }> = {
      VIDEO: { mobile: ['70vw', '65vw', '60vw', '70vw', '60vw'], desktop: ['50dvw', '50dvw', '48dvw', '40dvw', '40vw'] },
      CLOVERPRODUCTION: { mobile: ['65vw', '70vw', '80vw', '75vw'], desktop: ['45dvw', '50dvw', '70dvw', '60dvw'] },
    };
  
    const fallbackWidth = windowWidth ?? 1024; // Default to 1024 if null
    return widths[filterState as keyof typeof widths]?.[isMobile ? 'mobile' : 'desktop'][groupIndex] ??
      `${fallbackWidth <= 768 ? 70 : 50}vw`;
  };
  



  const generateUrl = (publicId: string) => {
    return publicId.includes('_GIF')
      ? cld.image(publicId).resize(auto())
      : cld.image(publicId).resize(auto().width(1000));
  }

  return (
    <div className={styles.heroGalleryContainer}>

      <React.Fragment key={`group-${group}`}>

        {/* Wide photo spanning both columns */}
        {group.widePhoto && (
          <div className={styles.widePhotoContainer} style={{ width: calculateWidth(groupIndex) }}>
            <div style={{ width: '100%', paddingTop: '4px' }}>
              <AdvancedImage
                onClick={() => openModal('gallery', group.widePhoto.folderName)}
                onContextMenu={preventRightClick} cldImg={generateUrl(group.widePhoto.publicId)}
                className={styles.widePhoto}
                // plugins={[lazyload({ rootMargin: '10px 20px 10px 30px', threshold: 0.25 })]}
              />
            </div>
          </div>
        )}

        {/* VARYING HEIGHT OF COLUMNS BASED ON NUMBER OF PHOTOS IN THE COLUMN
        if there are 5 photos, height stays the same, */}
        {group.leftColumn.length > 0 && group.rightColumn.length > 0 &&
         <div style={{ display: 'flex', gap: '8px', height: calculateHeight(group.leftColumn.length, groupIndex), }}>

         {/* Left Column */}
         <div className={styles.leftColumnContainer}>
           {group.leftColumn.map((photo, index) => (
             <div className={styles.leftColumnFlex}
               style={{ height: `${group.leftColumnHeights[index]}%` }}
             >
               <AdvancedImage
                 className={styles.clickablePhoto} onClick={() => openModal('gallery', photo.folderName)} onContextMenu={preventRightClick}
                 cldImg={generateUrl(photo.publicId)} style={{ objectFit: 'fill', objectPosition: 'right',  height: '100%' }}
                  // plugins={[lazyload({ rootMargin: '10px 20px 10px 30px', threshold: 0.25 })]}
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
                 className={styles.clickablePhoto} onClick={() => openModal('gallery', photo.folderName)} onContextMenu={preventRightClick}
                 cldImg={generateUrl(photo.publicId)} style={{ objectFit: 'fill', objectPosition: 'left', height: '100%' }}
                  // plugins={[lazyload({ rootMargin: '10px 20px 10px 30px', threshold: 0.25 })]}
               />
             </div>
           ))}
         </div>
       </div>
        }
       
      </React.Fragment>
    </div>
  );
};

export default HeroGallery;
