import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdvancedImage } from '@cloudinary/react'; // Adjust according to how you're using Cloudinary
import styles from '../styles/HeroGallery.module.css'; // Import CSS module
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
  const [filteredPhotos, setFilteredPhotos] = useState<Set<string>>(new Set()); // Set to track removed photos

  // Function to remove or add back random photos
  const toggleRandomPhotos = () => {
    setPhotoRows((prevRows) => {
      const flatPhotos = prevRows.flat();
      const newFilteredPhotos = new Set(filteredPhotos);

      // Determine if we are currently filtering photos or adding them back
      if (newFilteredPhotos.size > 0) {
        // If there are already filtered photos, restore them
        flatPhotos.forEach(photo => {
          if (newFilteredPhotos.has(photo.folder)) {
            newFilteredPhotos.delete(photo.folder); // Remove from filtered set to add back
          }
        });
      } else {
        // Remove several random photos
        const numToRemove = Math.floor(Math.random() * (Math.min(3, flatPhotos.length))) + 1; // Random number of photos to remove
        const photosToRemove = new Set();

        while (photosToRemove.size < numToRemove) {
          const randomIndex = Math.floor(Math.random() * flatPhotos.length);
          const photo = flatPhotos[randomIndex];
          photosToRemove.add(photo.folder); // Use unique folder names
        }

        // Add these photos to the filtered set
        photosToRemove.forEach(folder => newFilteredPhotos.add(folder));
      }

      const newPhotoRows: Photo[][] = [];

      // Rebuild the 2D array of photo rows, excluding the filtered photos
      flatPhotos.forEach(photo => {
        if (!newFilteredPhotos.has(photo.folder)) {
          newPhotoRows.push([photo]); // Create rows with remaining photos
        }
      });

      setFilteredPhotos(newFilteredPhotos); // Update filtered photos set
      return newPhotoRows; // Return the updated photo rows
    });
  };

  // Effect to create initial photo rows
  useEffect(() => {
    const allPhotos: Photo[] = columns.flat();
    let double = false;
    let newPhotoRows: Photo[][] = [];

    while (allPhotos.length > 0) {
      let row = [];
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
    console.log("New Photo rows");
    console.log(newPhotoRows);
    setPhotoRows(newPhotoRows);
  }, [columns]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '80dvw',
    }}>
      <button onClick={toggleRandomPhotos} style={{ marginBottom: '20px' }}>
        {filteredPhotos.size > 0 ? 'Add Back Photos' : 'Remove Random Photos'}
      </button>
      <AnimatePresence mode='popLayout'>
        {photoRows.map((row, rowIndex) => (
          <div key={rowIndex} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            marginTop: '4px',
            marginBottom: '4px',
          }}>
            {row.map((photo, photoIndex) => (
              <motion.div
                key={photo.folder}
                layout='position'
                initial={{ opacity: 0 }} // Fade in from above
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
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
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default HeroGallery;
