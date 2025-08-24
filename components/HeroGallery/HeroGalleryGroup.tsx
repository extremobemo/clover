import React, { useState, useEffect } from 'react';
import { AdvancedImage, lazyload } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { GalleryGroup, GalleryDescription } from '../../types/types';

import styles from '../../styles/HeroGallery.module.css'
import overlayStyles from '../../styles/HeroGalleryOverlay.module.css';
import { useAppContext } from '../../context/AppContext';
import { auto } from '@cloudinary/url-gen/actions/resize';
import AutoScaleText from '../common/AutoScaleText';


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
  const [descriptions, setDescriptions] = useState<{ [key: string]: GalleryDescription }>({});

  useEffect(() => {
    const fetchDescriptions = async () => {
      const newDescriptions: { [key: string]: GalleryDescription } = {};
      for (const photo of group.leftColumn) {
        if (!descriptions[photo.folderName]) {
          const res = await fetch(`/api/projectAssets?folder=${photo.folderName}`);
          const data = await res.json();
          newDescriptions[photo.folderName] = data.description;
        }
      }
      for (const photo of group.rightColumn) {
        if (!descriptions[photo.folderName]) {
          const res = await fetch(`/api/projectAssets?folder=${photo.folderName}`);
          const data = await res.json();
          newDescriptions[photo.folderName] = data.description;
        }
      }
      if (group.widePhoto && !descriptions[group.widePhoto.folderName]) {
        const res = await fetch(`/api/projectAssets?folder=${group.widePhoto.folderName}`);
        const data = await res.json();
        newDescriptions[group.widePhoto.folderName] = data.description;
      }
      setDescriptions(prev => ({ ...prev, ...newDescriptions }));
    }
    fetchDescriptions();

    // Set window width only on the client
    setWindowWidth(window.innerWidth);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [group]);

  const getGalleryTitle1 = (folderName: string) => {
    const description = descriptions[folderName];

    //TESTING: defaulting to subject since we have all of those
    return description?.subject; //DEFAULT TO CLOVER MODE IF TITLE NOT CONFIGURED


    return description?.mainGalleryTitle1 == null || description?.mainGalleryTitle1 == '' ? "ClOVER MODE CLOVER MODE" : description?.mainGalleryTitle1; //DEFAULT TO CLOVER MODE IF TITLE NOT CONFIGURED
  };

  const getGalleryTitle2 = (folderName: string) => {
    const description = descriptions[folderName];
    //TESTING: defaulting to regular title since we have those for now
    return description?.title; //DEFAULT TO CLOVER MODE IF TITLE NOT CONFIGURED

    return description?.mainGalleryTitle2 == null || description?.mainGalleryTitle2 == '' ? "CLOVER MODE" : description?.mainGalleryTitle2; //DEFAULT TO CLOVER MODE IF TITLE NOT CONFIGURED

  };

  const newGetGalleryTitles = (folderName: string, parentId: string) => {
    const description = descriptions[folderName];
   
    return (
      <>
        <AutoScaleText parentId={parentId} text={getGalleryTitle1(folderName)} widthPercentage={85} />
        <AutoScaleText parentId={parentId} text={getGalleryTitle2(folderName)} widthPercentage={85} />
      </>
    );
  };

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
            <div className={overlayStyles.itemContainer} style={{ position: 'relative' }}>
              <AdvancedImage id={`widePhotoImage-${groupIndex}-${group.widePhoto.publicId}`}
                onClick={() => openModal('gallery', group.widePhoto.folderName)}
                onContextMenu={preventRightClick} cldImg={generateUrl(group.widePhoto.publicId)}
                className={styles.widePhoto}
              />
              <div className={overlayStyles.overlay}>
                {newGetGalleryTitles(group.widePhoto.folderName, `widePhotoImage-${groupIndex}-${group.widePhoto.publicId}`)}
              </div>
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
                <div className={`${styles.leftColumnFlex} ${overlayStyles.itemContainer}`}
                  style={{ height: `${group.leftColumnHeights[index]}%` }}
                >
                  <AdvancedImage
                    id={`leftColumnImage-${groupIndex}-${index}-${photo.publicId}`}
                    className={styles.clickablePhoto} onClick={() => openModal('gallery', photo.folderName)} onContextMenu={preventRightClick}
                    cldImg={generateUrl(photo.publicId)} style={{ objectFit: 'fill', objectPosition: 'right', height: '100%' }}
                  // plugins={[lazyload({ rootMargin: '10px 20px 10px 30px', threshold: 0.25 })]}
                  />
                  <div className={overlayStyles.overlay}>
                    {newGetGalleryTitles(photo.folderName, `leftColumnImage-${groupIndex}-${index}-${photo.publicId}`)}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div className={styles.rightColumnContainer}>
              {group.rightColumn.map((photo, index) => (
                <div className={`${styles.rightColumnFlex} ${overlayStyles.itemContainer}`}
                  style={{ height: `${group.rightColumnHeights[index]}%` }}
                >
                  <AdvancedImage id={`rightColumnImage-${groupIndex}-${index}-${photo.publicId}`}
                    className={styles.clickablePhoto} onClick={() => openModal('gallery', photo.folderName)} onContextMenu={preventRightClick}
                    cldImg={generateUrl(photo.publicId)} style={{ objectFit: 'fill', objectPosition: 'left', height: '100%' }}
                  // plugins={[lazyload({ rootMargin: '10px 20px 10px 30px', threshold: 0.25 })]}
                  />
                  <div className={overlayStyles.overlay}>
                    {newGetGalleryTitles(photo.folderName, `rightColumnImage-${groupIndex}-${index}-${photo.publicId}`)}
                  </div>
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
