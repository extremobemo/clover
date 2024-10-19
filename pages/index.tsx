import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import PageTransition from "../components/common/PageTransition";
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import GreenBar from '../components/common/bar';

import Modal from '../components/gallery/ModalGallery';
import Curtain from '../components/Curtain';
import HeroGallery from '../components/HeroGallery';
import { HeroImageData } from '../types/types';

interface Photo {
  image: CloudinaryImage;
  folder: string;
 
    width: number,
   

}

const HeroPage: React.FC = () => {
  const router = useRouter();

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [imageOffScreen, setImageOffScreen] = useState<boolean>(false);
  const [showGreenBar, setShowGreenBar] = useState<boolean>(false);

  const [showGallery, setShowGallery] = useState<boolean>(false);
  const [public_id, setPublicId] = useState<string | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const cld = new Cloudinary({ cloud: { cloudName: 'ddlip2prr' } });

 // Restore scroll position when the modal is closed
  useEffect(() => {
    if (!showGallery) {
      document.documentElement.style.overflowY = 'auto'; 
      window.scrollTo(0, scrollPosition);
    }
  }, [showGallery, scrollPosition]);


  //set showGallery and gallery publicID based on url param
  useEffect(() => {
    //TODO: will need to scrub the url param to handle invalid args
    const gallery = router.query.gallery;
    if (typeof gallery === 'string') {
      setShowGallery(true);
      setPublicId(gallery);
    } else {
      setShowGallery(false);
      setPublicId(null);
    }
  }, [router.query.gallery]);

  // Fetch Hero Photos
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch('/api/photos');
        const data = await response.json();
  
        const cloudinaryPhotos: Photo[] = await Promise.all(
          data.map(async (photo: HeroImageData) => {
            const cloudImage: CloudinaryImage = cld.image(photo.public_id).resize(auto().height(500));
  
            // Create an Image object to fetch the image and get dimensions
            const img = new Image();
            img.src = cloudImage.toURL(); // Generate the URL
  
            // Return a Promise that resolves when the image is loaded
            return new Promise((resolve) => {
              img.onload = () => {
                const originalWidth = img.width; // Get the original width
                const originalHeight = img.height; // Get the original height
                console.log("OG WIDTH: " + originalWidth)
                console.log("OG WIDTH: " + originalWidth)
                // Calculate the new width based on the aspect ratio
                const newWidth = originalWidth
                console.log(newWidth)
                resolve({
                  image: cloudImage,
                  folder: photo.folder,
                  width: newWidth, // Include calculated width in the returned object
                });
              };
              img.onerror = () => {
                console.error(`Failed to load image for public ID: ${photo.public_id}`);
                resolve({
                  image: cloudImage,
                  folder: photo.folder,
                  width: 0, // Default to 0 if there's an error loading the image
                });
              };
            });
          })
        );
  
        setPhotos(cloudinaryPhotos);
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    };
  
    fetchPhotos();
  }, []);
  
  

  // open or close gallery overlay and handle disabling or enabling background scroll
  const handleModal = (isOpening: boolean, newPublicId: string | null) => {
    if (isOpening) {  
      router.push(`/?gallery=${newPublicId}`, undefined, {shallow: true});
      setShowGallery(true);
      setScrollPosition(window.scrollY);
      document.documentElement.style.overflowY = 'hidden';
    } else {
      router.push('/', undefined, { shallow: true });
      setShowGallery(false);
      setPublicId(null)
      document.documentElement.style.overflowY = 'auto';
      window.scrollTo(0, scrollPosition);
    }
  }

  const leftColumn : Photo[] = photos.filter((_, index) => index % 2 === 0);
  const rightColumn : Photo[] = photos.filter((_, index) => index % 2 !== 0);
  const columns : Photo[][] = [leftColumn, rightColumn]

  return (
    <div id="outermost_div"
      style={{ display: 'flex', justifyContent: 'center',
      overflowY: 'hidden', height: '100dvh', overflowX: 'hidden'}} >

      {!imageOffScreen && (
        <Curtain imageOffScreen={imageOffScreen} setImageOffScreen={setImageOffScreen} setShowGreenBar={setShowGreenBar}/>
      )}

      {/* {showGreenBar && (<GreenBar text="CLOVER." />)} */}
      
      <div id="content_div" style={{ display: 'flex', position: 'absolute',
        zIndex: 1, justifyContent: 'center',
        overflowY : 'hidden', overflowX : 'hidden' }}>

        {!showGallery && 
          <HeroGallery photos={photos} handleModal={handleModal} /> }
        </div>

      {showGallery && <Modal onClose={ () => handleModal(false, null)} public_id={public_id} /> }
    </div>
  );
};

export default HeroPage;
