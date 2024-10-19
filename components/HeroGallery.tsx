import React, {useState, useEffect} from 'react';
import { motion } from 'framer-motion';
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

    //todo: divide photos into new 2d array "rows"
    const [photoRows, setPhotoRows] = useState<Photo[][]>([]);

    //Sorta aids way to add photo arrays of alternating length (between 1 and 2) to the 2d photo array representing each row
    useEffect(() => {
        const allPhotos : Photo[] = columns.flat();
        
        let double = false;

        let newPhotoRows = [];

        while (allPhotos.length > 0) {
            let row = [];
            if (double)
            {
                const firstPhoto = allPhotos.shift();
                const secondPhoto = allPhotos.shift();
                if (firstPhoto) 
                    row.push(firstPhoto);
                if (secondPhoto) 
                    row.push(secondPhoto);
            }
            else{
                const singlePhoto = allPhotos.shift();
                if (singlePhoto) 
                    row.push(singlePhoto);
            }
    
            newPhotoRows.push(row);
            double = !double;

        }
        console.log("New Photo rows")
        console.log(newPhotoRows);
        setPhotoRows(newPhotoRows);

    }, [columns]);



  return (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '80dvw',
      }}>
      {photoRows.map((row, rowIndex) => (
        <div key={rowIndex} style={
            {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            marginTop: '4px',
            marginBottom:'4px',
            }
        }>
            {row.map((photo, photoIndex) => (
                <motion.div style={
                        {
                        maxWidth: '50%',
                        marginLeft: '16px',
                        marginRight: '16px',
                        }
                    }
                   >
                    <AdvancedImage
                    onClick={() => handleModal(true, photo.folder)}
                    onContextMenu={preventRightClick}
                    cldImg={photo.image}
                
                    style={
                        { 
                           objectFit: 'cover',
                           width: '100%',
                        }
                    }
                    />
                </motion.div>
            ))}
            
        </div>
      ))}
    </div>
  );
};

export default HeroGallery;