import React from 'react';
import { motion } from 'framer-motion';
import { AdvancedImage } from '@cloudinary/react'; // Adjust according to how you're using Cloudinary
import styles from '../styles/Home.module.css'; // Import CSS module

const HeroGallery = ({ columns, handleModal }) => {
  let isLeftColumn = true; // Track if we're in the left column

    return (
      <div className={styles.grid}>
        {columns.map((photo, idx) => {
          const isFullWidth = idx % 7 === 0;
    
          return (
            <div key={idx} className={`${styles.griditem} ${isFullWidth ? styles.griditemfull : ''}`}>
              <div className={styles.photoContainer}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    height: 'auto',
                    overflow: 'hidden',
                  }}
                >
                  <AdvancedImage
                    onClick={() => handleModal(true, photo.folder)}
                    cldImg={photo.image}
                    className={styles.img} // Correctly using the img class here
                    style={{
                      width: '100%', // Fill the width of the container
                      height: 'auto', // Allow for natural height
                      objectFit: 'cover', // Maintain aspect ratio
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
    );
    
  
  
};



  // return (
  //   <div className={styles.galleryContainer}>
  //     {columns.map((column, columnIndex) => (
  //       <div key={columnIndex} className={styles.column}>
  //         {column.map((photo, index) => (
  //           <div key={index} className={styles.photoContainer}>
  //             <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
  //               <AdvancedImage
  //                 onClick={() => handleModal(true, photo.folder)}
  //                 cldImg={photo.image}
  //                 className="advanced-image"
  //                 style={{ width: '100%', borderRadius: '4px' }}
  //                 transition={{
  //                   duration: 0.3
  //                 }}
  //               />
  //             </motion.div>
  //           </div>
  //         ))}
  //       </div>
  //     ))}
  //   </div>
  // );


export default HeroGallery;