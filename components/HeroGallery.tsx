import React from 'react';
import { motion } from 'framer-motion';
import { AdvancedImage } from '@cloudinary/react'; // Adjust according to how you're using Cloudinary
import styles from '../styles/HeroGallery.module.css'; // Import CSS module
import { Photo } from '../types/types';
import ScrollIndicator from './common/ScrollIndicator';

interface HeroGalleryProps {
  columns: Photo[][],
  handleModal : (isOpening : boolean, folder: string | null) => void;
}

const preventRightClick = (e : React.MouseEvent) => {
  e.preventDefault();
}

const HeroGallery : React.FC<HeroGalleryProps> = ({ columns, handleModal }) => {
  return (
    <div className={styles.galleryContainer}>
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className={styles.column}>
           <ScrollIndicator/>
          {column.map((photo, index) => (
            <motion.div
              key={index}
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
          ))}
        </div>
      ))}
    </div>
  );
};

export default HeroGallery;