import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdvancedImage } from '@cloudinary/react'; 
import styles from '../styles/HeroGallery.module.css'; 
import { Photo } from '../types/types';

interface HeroGalleryProps {
  columns: Photo[][],
  handleModal : (isOpening: boolean, folder: string | null) => void;
}

const preventRightClick = (e: React.MouseEvent) => {
  e.preventDefault();
};

const HeroGallery: React.FC<HeroGalleryProps> = ({ columns, handleModal }) => {
  const [filteredColumns, setFilteredColumns] = useState(columns);
  const [isFiltered, setIsFiltered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false); // New state to track transition

  const filterPhotos = () => {
    if (!isTransitioning) {
      setIsTransitioning(true); // Prevent rapid toggle while transitioning

      // Trigger exit first, then show the filtered or unfiltered images
      setTimeout(() => {
        if (!isFiltered) {
          const newFilteredColumns = columns.map(column =>
            column.filter((_, index) => (index + 1) % 3 !== 0)
          );
          setFilteredColumns(newFilteredColumns);
        } else {
          setFilteredColumns(columns);
        }
        setIsFiltered(!isFiltered);

        setTimeout(() => {
          setIsTransitioning(false); // Re-enable toggling after the transition
        }, 500); // Allow time for the transition to complete
      }, 500); // Matches the exit animation duration
    }
  };

  // Ensure `filteredColumns` is always synced with `columns`
  useEffect(() => {
    setFilteredColumns(columns);
  }, [columns]);

  return (
    <div>
      <button onClick={filterPhotos} disabled={isTransitioning}>
        {isFiltered ? 'Show All Photos' : 'Filter Every 3rd Photo'}
      </button>

      <div className={styles.galleryContainer}>
        <AnimatePresence>
          {filteredColumns.map((column, columnIndex) => (
            <div key={columnIndex} className={styles.column}>
              {column.map((photo) => (
                <motion.div
                  key={photo.folder} // Ensure unique key
                  className={styles.photoContainer}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }} // Exit animation (scale down and fade out)
                  transition={{
                    duration: 0.5,
                    //ease: 'easeInOut',
                  }}
                  whileHover={{ scale: 1.05 }} // Subtle hover effect
                >
                  <motion.div
                    layout
                    whileHover={{ scale: 1.08 }}
                    transition={{ 
                      duration: 0.4, 
                      //ease: 'easeInOut' 
                      }}
                    className={styles.imageWrapper}
                  >
                    <AdvancedImage
                      onClick={() => handleModal(true, photo.folder)}
                      onContextMenu={preventRightClick}
                      cldImg={photo.image}
                      className={styles.advancedImage}
                      style={{ width: '100%' }}
                    />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HeroGallery;
