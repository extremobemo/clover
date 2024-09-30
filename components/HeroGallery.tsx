import React from 'react';
import { motion } from 'framer-motion';
import { AdvancedImage } from '@cloudinary/react'; // Adjust according to how you're using Cloudinary
import styles from '../styles/HeroGallery.module.css'; // Import CSS module
import { Photo } from '../types/types';

interface HeroGalleryProps {
  columns: Photo[][],
  handleModal : (isOpening : boolean, folder: string | null) => void;
}

const HeroGallery : React.FC<HeroGalleryProps> = ({ columns, handleModal }) => {
  return (
    <div className={styles.galleryContainer}>
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className={styles.column}>
          {column.map((photo, index) => (
            <div key={index} className={styles.photoContainer}>
              <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
                <AdvancedImage
                  onClick={() => handleModal(true, photo.folder)}
                  cldImg={photo.image}
                  className="advanced-image"
                  style={{ width: '100%', borderRadius: '4px' }}
                  transition={{
                    duration: 0.3
                  }}
                />
              </motion.div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default HeroGallery;