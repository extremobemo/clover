import React from 'react';
import { motion } from 'framer-motion';
import { AdvancedImage } from '@cloudinary/react'; // Adjust according to how you're using Cloudinary
import styles from '../styles/HeroGallery.module.css'; // Import CSS module
import { Photo } from '../types/types';
import {SpringGrid, measureItems, layout} from 'react-stonecutter'

interface HeroGalleryProps {
  columns: Photo[][],
  handleModal : (isOpening : boolean, folder: string | null) => void;
}

const preventRightClick = (e : React.MouseEvent) => {
  e.preventDefault();
}

const Grid = measureItems(SpringGrid)

const HeroGallery : React.FC<HeroGalleryProps> = ({ columns, handleModal }) => {
  return (
    <div className={styles.galleryContainer}>
     <Grid
  component="ul"
  columns={2}
  columnWidth={350}
  gutterWidth={10}
  gutterHeight={5}
  layout={layout.pinterest}
  {...({ children: columns[0].map((photo, index) => (
    <li key={index}>
      <motion.div
        className={styles.photoContainer}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}>

        <motion.div whileHover={{ scale: 1.08 }} transition={{ duration: 0.4, ease: 'easeInOut' }}
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
    </li>
  ))})}
/>
    </div>
  );
};

export default HeroGallery;