import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

const GalleryRow = ({ photos, handleClick, clickedImage }) => {
  const router = useRouter();

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
      padding: '0 5vw', // Responsive padding using viewport width
      flexWrap: 'wrap', // Allow items to wrap to the next line if needed
    }}>
      {photos.map((photo, index) => (
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
          <div style={{ height: '80vh', marginBottom: '10px', position: 'relative', width: '100%' }}>
            <motion.img
            whileHover={{scale: 1.1}}
              src={photo.url}
              style={{
                height: '100%',
                width: '100%',
                objectFit: 'cover',
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default GalleryRow;
