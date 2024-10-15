import React, {useState, useEffect} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdvancedImage } from '@cloudinary/react'; // Adjust according to how you're using Cloudinary
import styles from '../styles/HeroGallery.module.css'; // Import CSS module
import { Photo } from '../types/types';

interface HeroGalleryProps {
  columns: Photo[][],
  handleModal : (isOpening : boolean, folder: string | null) => void;
}

const preventRightClick = (e : React.MouseEvent) => {
  e.preventDefault();
}

const HeroGallery : React.FC<HeroGalleryProps> = ({ columns, handleModal }) => {

  const [filteredColumns, setFilteredColumns] = useState(columns);
  const [isFiltered, setIsFiltered] = useState(false);

  const filterPhotos = () => {
    if (!isFiltered) {
      // Take out every 3rd photo in each column
      const newFilteredColumns = columns.map(column => 
        column.filter((_, index) => (index + 1) % 2 !== 0)
      );
      setFilteredColumns(newFilteredColumns);
    } else {
      // Reset to unfiltered columns
      setFilteredColumns(columns);
    }
    setIsFiltered(!isFiltered);
  };

  // Ensure `filteredColumns` is always synced with `columns`
  useEffect(() => {
    setFilteredColumns(columns);
  }, [columns]);

  return (
    <div>
       <button onClick={filterPhotos}>
        {isFiltered ? 'Show All Photos' : 'Filter Every 3rd Photo'}
      </button>
    <div className={styles.galleryContainer}>
    <AnimatePresence>
      {filteredColumns.map((column, columnIndex) => (
        <div key={columnIndex} className={styles.column}>
          {column.map((photo, index) => (
            <motion.div
              key={photo.folder}
              className={styles.photoContainer}
              layout // Enables Framer Motion layout animations
              initial={{ opacity: 0, }}
              animate={{ opacity: 1, }}
              exit={{ opacity: 0,}}
              whileHover={{ scale: 1.01 }}
              transition={{ 
                duration: 1, 
                delay: (index + columnIndex) * 0.1,
                ease: 'easeInOut',
                layout: {duration: 1} 
              }}
              >

                <motion.div whileHover={{ scale: 1.08 }} /* zoom in effect */
                 transition={{ 
                  duration: 0.9, 
                  ease: 'easeOut',
                  layout: {duration: 0.5} 
                }}
                  className={styles.imageWrapper}>

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