import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdvancedImage } from '@cloudinary/react';
import styles from '../styles/HeroGallery.module.css';
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
  const [filteredPhotos, setFilteredPhotos] = useState<Set<string>>(new Set());
  const [emptyRows, setEmptyRows] = useState<number[]>([]); // Keep track of rows that need delayed removal


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



  // Function to remove or add back random photos
  // This is some ChatGPT BS, there is definitely a better way
  const togglePhotosByIndex = (indicesToRemove: number[]) => {
    setPhotoRows((prevRows) => {
      const flatPhotos = prevRows.flat();
      const updatedFilteredPhotos = new Set(filteredPhotos);
      let emptyRows: number[] = []; // Track rows that will become empty
  
      // Remove the photos at the given indices
      indicesToRemove.forEach((index) => {
        const photo = flatPhotos[index];
        if (photo) {
          updatedFilteredPhotos.add(photo.folder); // Add photo to be filtered out
        }
      });
  
      // Rebuild the photo rows, delaying the removal of empty rows
        const newPhotoRows = prevRows.map((row, rowIndex) => {
          const filteredRow = row.filter((photo) => !updatedFilteredPhotos.has(photo.folder));
          if (filteredRow.length === 0) {
            emptyRows.push(rowIndex); // Mark row for delayed removal
          }
          return filteredRow;
        });
      setFilteredPhotos(updatedFilteredPhotos);
      return newPhotoRows; // Return the updated photo rows with filtered photos
    });
  };

  // Remove empty rows after the animation delay
    useEffect(() => {
      if (emptyRows.length > 0) {
        const timeout = setTimeout(() => {
          setPhotoRows((prevRows) => prevRows.filter((_, index) => !emptyRows.includes(index)));
          setEmptyRows([]); // Clear empty rows after removal
        }, 1000); // Delay removal by 1 second (adjust as needed)
        return () => clearTimeout(timeout);
      }
    }, [emptyRows]);

  // Effect to create initial photo rows
   useEffect(() => {
    const allPhotos: Photo[] = columns.flat();
    setPhotoRows(buildPhotoRows(allPhotos));
  }, [columns]);

  return (
    <AnimatePresence>
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
        transition={{ duration: 0.5 }}
      >
        <button onClick={() => togglePhotosByIndex([0, 3, 5, 6])} style={{ position:'fixed', marginBottom: '20px' }}>
          {filteredPhotos.size > 0 ? 'Add Back Photos' : 'Remove Random Photos'}
        </button>
        
        {photoRows.map((row, rowIndex) => (
          <AnimatePresence key={`row-${rowIndex}`}>
            {row.length > 0 && (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ scale: 0, height: 0 }}
                transition={{ duration: 0.5 }}
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
                    key={photo.folder}
                    layout
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <AdvancedImage
                      onClick={() => handleModal(true, photo.folder)}
                      onContextMenu={preventRightClick}
                      cldImg={photo.image}
                      style={{
                        objectFit: 'cover',
                        height: '100%',
                        marginLeft: '8px',
                        marginRight: '8px',
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default HeroGallery;
