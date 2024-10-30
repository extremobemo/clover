import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import PageTransition from "../components/common/PageTransition";
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import Modal from '../components/gallery/ModalGallery';
import Curtain from '../components/Curtain';
import HeroGallery from '../components/HeroGallery';
import { HeroImageData } from '../types/types';

interface Photo {
  image: CloudinaryImage;
  folder: string;
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

//TODO: here we still need this logic that gets args out of url and decides what modal to open, but a lot of the "opening" and "closing" code can go in the context
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

        const cloudinaryPhotos : Photo[] = data.map((photo: HeroImageData) => {
          const cloudImage : CloudinaryImage = cld.image(photo.public_id).resize(auto().width(500));
          return {
            image: cloudImage,
            folder: photo.folder,
          };
        });
        setPhotos(cloudinaryPhotos);
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    };
   
    fetchPhotos();
  }, []);


  //TODO: this logic can probably all be in the context, maybe not the document stuff tho, idk, and the set scroll position stuff

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

  //TODO: utilize new context states to control visibility of this stuff

  return (
    <div id="outermost_div"
      style={{ display: 'flex', justifyContent: 'center',
      overflowY: 'hidden', height: '100dvh', overflowX: 'hidden'}} >

      {!imageOffScreen && (
        <Curtain imageOffScreen={imageOffScreen} setImageOffScreen={setImageOffScreen} setShowGreenBar={setShowGreenBar}/>
      )}

      {/* {showGreenBar && (<GreenBar text="CLOVER." />)} */}
      
      <div id="content_div" style={{ display: 'flex', position: 'absolute',
        zIndex: 1, height: '600vh', justifyContent: 'center',
        overflowY : 'hidden', overflowX : 'hidden' }}>

         
          <HeroGallery columns={columns} handleModal={handleModal} /> 
      </div>

      {showGallery && <Modal state='gallery' onClose={ () => handleModal(false, null)} public_id={public_id} /> }
    </div>
  );
};

export default HeroPage;
