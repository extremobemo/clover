import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdvancedImage } from '@cloudinary/react';
import { Photo } from '../types/types';

interface HeroGalleryProps {
  columns: Photo[][],
  handleModal: (isOpening: boolean, folder: string | null) => void;
}

const preventRightClick = (e: React.MouseEvent) => {
  e.preventDefault();
}

const HeroGallery: React.FC<HeroGalleryProps> = ({ columns, handleModal }) => {
  const [photoRows, setPhotoRows] = useState<Photo[][]>([]);
  const [visiblePhotos, setVisiblePhotos] = useState<Set<string>>(new Set());

  // Log columns to verify correct structure
  useEffect(() => {
    console.log("Columns prop:", JSON.stringify(columns)); // Log columns for debugging
  }, [columns]);

  // Function to create photo rows with a 1, 2, 1 layout
  const buildPhotoRows = (allPhotos: Photo[]) => {
    let double = false;
    let newPhotoRows: Photo[][] = [];

    while (allPhotos.length > 0) {
      let row: Photo[] = [];
      if (double) {
        const firstPhoto = allPhotos.shift();
        const secondPhoto = allPhotos.shift();
        if (firstPhoto) row.push(firstPhoto);
        if (secondPhoto) row.push(secondPhoto);
      } else {
        const singlePhoto = allPhotos.shift();
        if (singlePhoto) row.push(singlePhoto);
      }
      newPhotoRows.push(row);
      double = !double;
    }

    return newPhotoRows;
  };

  // Effect to create initial photo rows and set all photos as visible
  useEffect(() => {
    const allPhotos: Photo[] = columns.flat();
    if (allPhotos.length === 0) {
      console.warn("No photos available in columns."); // Debugging log
      return;
    }

    const initialPhotoRows = buildPhotoRows(allPhotos);
    setPhotoRows(initialPhotoRows);

    // Initialize visible photos to include all initially
    const initialVisiblePhotos = new Set(initialPhotoRows.flatMap(row => row.map(photo => photo.folder)));
    setVisiblePhotos(initialVisiblePhotos);

    console.log("Initial Photo Rows:", initialPhotoRows); // Log photo rows for debugging
    console.log("Initial Visible Photos:", Array.from(initialVisiblePhotos)); // Log visible photos for debugging

  }, [columns]);

  // Function to toggle photos based on their indices
  const togglePhotosByIndex = () => {
    setPhotoRows(prevRows => {
      const flatPhotos = prevRows.flat();
      const updatedVisiblePhotos = new Set(visiblePhotos); // Clone the current set

      // We will randomly remove some photos (for demonstration, we can choose 3 photos)
      const indicesToRemove = [0, 3, 5, 6]; // You can adjust these indices as needed

      indicesToRemove.forEach(index => {
        const photo = flatPhotos[index];
        if (photo) {
          if (updatedVisiblePhotos.has(photo.folder)) {
            updatedVisiblePhotos.delete(photo.folder); // Remove if currently visible
          } else {
            updatedVisiblePhotos.add(photo.folder); // Add back if not visible
          }
        }
      });

      setVisiblePhotos(updatedVisiblePhotos); // Update visible photos state
      return prevRows; // Return the existing rows (no changes needed here)
    });
  };

  return (
    
      <motion.div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          width: '80dvw',
        }}
        key="MAIN_FLEX"
        layout='position'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 5.5 }}
      >
        <button onClick={togglePhotosByIndex} style={{ position: 'fixed', marginBottom: '20px' }}>
          {visiblePhotos.size < photoRows.flat().length ? 'Add Back Photos' : 'Remove Random Photos'}
        </button>

        {photoRows.map((row, rowIndex) => (
          <AnimatePresence>
            {row.length > 0 && (
              <motion.div
                key={`row-${rowIndex}`}
                layout="position"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ scale: 0, height: 0 }}
                transition={{ duration: 5.5 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  marginTop: '4px',
                  marginBottom: '4px',
                }}
              >
                {row.map((photo) => (
                  <motion.div
                    style={{
                      objectFit: 'cover',
                      marginLeft: '8px',
                      marginRight: '8px',
                    }}
                    key={photo.folder}
                    layout="position"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 5.5 }}
                  >
                    {visiblePhotos.has(photo.folder) && ( // Check if the photo is in the visible set
                      <AdvancedImage
                        onClick={() => handleModal(true, photo.folder)}
                        onContextMenu={preventRightClick}
                        cldImg={photo.image}
                        style={{
                          objectFit: 'cover',
                          width: '100%',
                          height: '100%',
                          marginLeft: '8px',
                          marginRight: '8px',
                        }}
                      />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </motion.div>
  );
};

export default HeroGallery;
