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
        column.filter((_, index) => (index) % 2 !== 0)
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
      <button onClick={filterPhotos} style={{position: 'fixed'}}>
        {isFiltered ? 'Show All Photos' : 'Filter Every 3rd Photo'}
      </button>
      <div
        className={styles.galleryContainer}
        style={{
          maxWidth: "1000px",
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem', // Space between items
        }}
      >
        <AnimatePresence mode='popLayout'>
          {filteredColumns.flat().map((photo) => (
            <motion.div
              key={photo.folder}
              // className={styles.photoContainer}
              layout='position'
              initial={{ opacity: 0 }} // Fade in from above
              animate={{opacity: 1}}
              exit={{ opacity: 0}}
              transition={{ duration: 0.7 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // Center vertically
                alignItems: 'center', // Center horizontally
                height: '100%', // Ensure the container takes full height
                padding: '1rem', // Equal space around each photo
              }}
            >
               <AdvancedImage
                    onClick={() => handleModal(true, photo.folder)}
                    onContextMenu={preventRightClick}
                    cldImg={photo.image}
                    className={styles.advancedImage}
                    style={{ width: '100%' }}
                  />
                   
            </motion.div>

          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HeroGallery;