import React, { useState, useEffect} from 'react';
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

  useEffect(() => {
    setFilteredColumns(columns);
  }, [columns]);

  const toggleFilter = () => {
    const empty : Photo[][] = [[],[]];
    if (!isFiltered) {
       const newFilteredColumns = filteredColumns.map((column, columnIndex) => 
        column.filter((_, index) => (index) % 3 !== 0)
       );
       
       //setFilteredColumns(empty);

       //setTimeout(() => {}, 2000);
     
       setFilteredColumns(newFilteredColumns);
    }
    else {
      //setFilteredColumns(empty);
    
      setFilteredColumns(columns);
      
    }
    setIsFiltered(!isFiltered);
  }



  return (
    <div>
      <button onClick={toggleFilter}> click to toggle filter</button> 

      <div className={styles.galleryContainer}>
        {filteredColumns.map((column, columnIndex) => (
          <div key={columnIndex} className={styles.column}>
            {column.map((photo, index) => (
              <AnimatePresence mode='popLayout' >
              <motion.div
              key={photo.folder}
                initial={{opacity:0, scale:.5}}
                animate={{opacity:1, scale: 1}}
                exit={{opacity:0}}
                layout
                transition={{ duration: 0.3, delay: (index + columnIndex) * 0.1 }}
              >

         
                <motion.div
                  key={photo.folder}
                  className={styles.photoContainer}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}>

                    <motion.div whileHover={{ scale: 1.08 }} /* zoom in effect */
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
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
              </motion.div>
              </AnimatePresence>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroGallery;