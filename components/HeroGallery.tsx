import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdvancedImage } from '@cloudinary/react';
import { Photo } from '../types/types';

interface HeroGalleryProps {
  photos: Photo[],
  handleModal: (isOpening: boolean, folder: string | null) => void;
}

const preventRightClick = (e: React.MouseEvent) => {
  e.preventDefault();
}

// Helper function to generate a random scale factor between 0.9 and 1.1
const getRandomScale = () => 0.9 + Math.random() * 0.2;

const heightData = [
  [
    [400, 600, 350, 550, 600],   // Column 1
    [525, 650, 500, 450, 375],  // Column 2
  ],
  [
    [500, 650, 500, 400, 450],   // Column 1
    [625, 450, 600, 450, 375],  // Column 2
  ],
  [
    [400, 600, 450, 550, 500],   // Column 1
    [325, 650, 500, 450, 575],  // Column 2
  ],
  [
    [400, 600, 450, 550, 500],   // Column 1
    [525, 650, 500, 450, 375],  // Column 2
  ],
  [
    [400, 600, 450, 550, 500],   // Column 1
    [525, 650, 500, 450, 375],  // Column 2
  ],
  [
    [400, 600, 450, 550, 500],   // Column 1
    [525, 650, 500, 450, 375],  // Column 2
  ],
];


const HeroGallery: React.FC<HeroGalleryProps> = ({ photos, handleModal }) => {
  const [visiblePhotos, setVisiblePhotos] = useState<Set<string>>(new Set());

  useEffect(() => {
    const initialVisiblePhotos = new Set(photos.map(photo => photo.folder));
    setVisiblePhotos(initialVisiblePhotos);
  }, [photos]);

  const togglePhotosByIndex = () => {
    setVisiblePhotos((prevVisiblePhotos) => {
      const updatedVisiblePhotos = new Set(prevVisiblePhotos);
      const indicesToToggle = [17, 19, 20, 21, 25, 26, 27, 30, 31, 35, 37, 41, 42, 43, 44, 49, 50];

      indicesToToggle.forEach(index => {
        const photo = photos[index];
        if (photo) {
          if (updatedVisiblePhotos.has(photo.folder)) {
            updatedVisiblePhotos.delete(photo.folder);
          } else {
            updatedVisiblePhotos.add(photo.folder);
          }
        }
      });

      return updatedVisiblePhotos;
    });
  };

 const getColumnGroups = () => {
    const groups = [];
    for (let i = 0; i < photos.length; i += 11) {
      const isEvenGroup = groups.length % 2 === 0;
      const leftColumn = isEvenGroup 
        ? photos.slice(i, i + 5) 
        : photos.slice(i, i + 5);
      const rightColumn = isEvenGroup 
        ? photos.slice(i + 5, i + 10) 
        : photos.slice(i + 5, i + 10);
      const widePhoto = photos[i + 10] ? [photos[i + 10]] : [];
      groups.push({ leftColumn, rightColumn, widePhoto });
    }
    return groups;
  };
  

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100vw',
        marginTop: 100,
        gap: '4px',
      }}
    >
      <button
        onClick={togglePhotosByIndex}
        style={{
          zIndex: 9999,
          position: 'fixed',
          top: '10px',
        }}
      >
        {visiblePhotos.size < photos.length ? 'Add Back Photos' : 'Remove Random Photos'}
      </button>

      {getColumnGroups().map((group, groupIndex) => (
        <React.Fragment key={`group-${groupIndex}`}>
          <div style={{ display: 'flex', width: '100vw', gap: '8px' }}>
            
            {/* Left Column */}
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '8px', 
              alignItems: 'flex-end' // Align images to the right in the left column
            }}>
              <AnimatePresence>
                {group.leftColumn.map((photo, index) => (
                  visiblePhotos.has(photo.folder) && (
                    <motion.div
                      key={photo.folder}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: heightData[groupIndex][0][index] }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 1 }}
                      style={{ display: 'flex', flex: '1 0 auto', width: 'max-content', alignItems: 'flex-end'}}
                    >
                      <div style={{ width: 'auto', height: heightData[groupIndex][0][index], padding: '0px' }}>
                        <AdvancedImage
                          onClick={() => handleModal(true, photo.folder)}
                          onContextMenu={preventRightClick}
                          cldImg={photo.image}
                          style={{ width: 'auto', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </div>

            {/* Right Column */}
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '8px', 
              alignItems: 'flex-start' // Align images to the left in the right column
            }}>
              <AnimatePresence>
                {group.rightColumn.map((photo, index) => (
                  visiblePhotos.has(photo.folder) && (
                    <motion.div
                      key={photo.folder}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: heightData[groupIndex][1][index] }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 1 }}
                      style={{ display: 'flex', flex: '1 0 auto', minHeight: '200px' }}
                    >
                      <div style={{ width: '100%', height: heightData[groupIndex][1][index], padding: '0px' }}>
                        <AdvancedImage
                          onClick={() => handleModal(true, photo.folder)}
                          onContextMenu={preventRightClick}
                          cldImg={photo.image}
                          style={{ height: '100%', objectFit: 'cover', width: 'max-content' }}
                        />
                      </div>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </div>
          </div>

{/* Wide photo spanning both columns */}
{group.widePhoto.length > 0 && (
  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4px' }}>
    <div style={{ maxHeight: 'max-content', margin: '0 auto' }}> {/* Added margin: auto */}
      <AnimatePresence>
        {group.widePhoto.map(photo => (
          visiblePhotos.has(photo.folder) && (
            <motion.div
              key={photo.folder}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 1 }}
              style={{ width: '100%' }}
            >
              <div style={{ width: '100%', padding: '4px' }}>
                <AdvancedImage
                  onClick={() => handleModal(true, photo.folder)}
                  onContextMenu={preventRightClick}
                  cldImg={photo.image}
                  style={{  height: '50%', objectFit: 'cover' }} // Changed width to 100%
                />
              </div>
            </motion.div>
          )
        ))}
      </AnimatePresence>
    </div>
  </div>
)}

        </React.Fragment>
      ))}
    </div>
  );
};

export default HeroGallery;
