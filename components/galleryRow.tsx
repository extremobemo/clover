import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const GalleryRow = ({ photos, handleClick }) => {
  // Check if photos is an array
  const photosArray = Array.isArray(photos) ? photos : [photos];

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
      padding: '0 5vw', // Responsive padding using viewport width
      flexWrap: 'wrap', // Allow items to wrap to the next line if needed
    }}>
      {photosArray.map((photo, index) => (
        <motion.div
          key={index}
          onClick={(e) => handleClick(photo.url, e)}
          style={{
            cursor: 'pointer',
            maxWidth: '700px',
            flex: '1 0 200px', // Flex properties to control sizing
            margin: '40px', // Spacing between items
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center', // Center content horizontally
          }}
          initial={{ opacity: 1 }}
          // animate={{ opacity: clickedImage === photo.url ? 1 : 0.5 }}
        >
          <div style={{ height: '80vh', width: 'auto', marginBottom: '10px', position: 'relative', width: '100%' }}>
            <Image
              src={photo.url}
              layout='fill'
              objectFit='cover'
              alt={photo.description || `Photo ${index + 1}`} // Use description or fallback to default alt text
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default GalleryRow;
