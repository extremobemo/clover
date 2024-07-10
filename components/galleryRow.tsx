import React from 'react';
import { motion } from 'framer-motion';

interface Photo {
  url: string;
  description: string;
}

interface GalleryRowProps {
  photos: Photo[];
}

const GalleryRow: React.FC<GalleryRowProps> = ({ photos }) => {
  return (
    <div className="gallery-row">
      {photos.map((photo, index) => (
        <div key={index} className="gallery-item">
          <motion.img
            whileHover={{ scale: 1.2 }}
            src={photo.url}
            alt={photo.description}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      ))}
      <style jsx>{`
        .gallery-row {
          display: flex;
          justify-content: center; /* Change from space-between to center */
          width: 100%;
          padding: 0 5%;
          box-sizing: border-box;
          flex-wrap: wrap;
        }
        .gallery-item {
          position: relative;
          height: 800px; /* Adjust height as needed */
          flex: 1;
          margin: 0 2%;
        }
        @media (max-width: 768px) {
          .gallery-item {
            flex: 0 0 100%;
            margin: 10px 0;
          }
        }
      `}</style>
    </div>
  );
}

export default GalleryRow;
