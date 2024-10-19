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
    let newPhotoRows: Photo[][] = [];
    let totalPhotos = allPhotos.length;
  
    // Define thresholds for "reasonably wide" aspect ratio
    const wideAspectRatioThreshold = 1.4;
  
    for (let i = 0; i < totalPhotos; i++) {
      const currentPhoto = allPhotos[i];
      const aspectRatio = currentPhoto.width / 500;
  
      // If the photo is wide, place it in its own row
      if (aspectRatio > wideAspectRatioThreshold) {
        newPhotoRows.push([currentPhoto]);
      } else {
        // Try to pair it with the next photo if it exists
        if (i < totalPhotos - 1) {
          const nextPhoto = allPhotos[i + 1];
          const nextAspectRatio = nextPhoto.width / 500;
  
          // Pair with the next photo if it’s also not wide
          if (nextAspectRatio <= wideAspectRatioThreshold) {
            newPhotoRows.push([currentPhoto, nextPhoto]);
            i++; // Skip the next photo as it’s now paired
          } else {
            // If the next photo is wide, add current photo alone
            newPhotoRows.push([currentPhoto]);
          }
        } else {
          // Last photo handling: if there is only one photo left
          newPhotoRows.push([currentPhoto]);
        }
      }
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
      const indicesToRemove = [17, 19, 20, 21, 25, 26, 27, 30, 31, 35, 37, 41, 42, 43, 44, 49, 50]

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
    <div>
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100vw', // Changed to vw for full width
        marginTop: 100,
        gap: '4px', // Set gap between rows
        height: '12000px' // Set a fixed height for the gallery
      }}
      key="MAIN_FLEX"
    >
      <button
        onClick={togglePhotosByIndex}
        style={{
          zIndex: 9999999,
          position: 'fixed',
          marginBottom: '20px',
        }}
      >
        {visiblePhotos.size < photoRows.flat().length
          ? 'Add Back Photos'
          : 'Remove Random Photos'}
      </button>
  
      {photoRows.map((row, rowIndex) => (
        <AnimatePresence key={`row-presence-${rowIndex}`} initial={false}>
          {row.some(photo => visiblePhotos.has(photo.folder)) && (
            <motion.div
              key={`row-${rowIndex}`}
              // layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ height: 0, opacity: 0, scale: 0 }}
              transition={{ duration: 1 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80vw', // Changed to vw for full width
              }}
            >
              <AnimatePresence>
                {row.map((photo) => (
                  visiblePhotos.has(photo.folder) && (
                    <motion.div
                      key={photo.folder}
                      // layout
                      exit={{
                        opacity: 0,
                        height: 0,
                        ...(row.length > 1 && { width: 0 }) // Conditional width animation
                      }}
                      initial={{ opacity: 0, width: 0, height: 0 }}
                      animate={{ opacity: 1, width: photo.width, height: '100%' }}
                      transition={{ duration: 1 }}
                      style={{
                        objectFit: 'cover',
                        marginLeft: '4px',
                        marginRight: '4px',
                        width: '100%', // Ensuring it fills the space
                      }}
                    >
                      <AdvancedImage
                        onClick={() => handleModal(true, photo.folder)}
                        onContextMenu={preventRightClick}
                        cldImg={photo.image}
                        style={{
                          objectFit: 'cover',
                          width: '100%',
                          marginLeft: '8px',
                          marginRight: '8px',
                        }}
                      />
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      ))}
    </div>
  </div>
  
  );
};

export default HeroGallery;
