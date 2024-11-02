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
import { useModal } from '../context/ModalContext';

interface Photo {
  image: CloudinaryImage;
  folder: string;
}

const HeroPage: React.FC = () => {
  const router = useRouter();
  const { showModal, modalState, publicId, openModal, closeModal } = useModal();

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [imageOffScreen, setImageOffScreen] = useState<boolean>(false);
  const [showGreenBar, setShowGreenBar] = useState<boolean>(false);

  const cld = new Cloudinary({ cloud: { cloudName: 'ddlip2prr' } });


  //when router is ready, grab arguments from router to determine which modal to display. This helps us with browser navigation stuff. 
  useEffect(() => {
    //TODO: will need to scrub the url param to handle invalid args

    if (!router.isReady) return; // Wait until the router is ready

    const gallery = router.query.gallery;
    const page = router.query.page;
    if (typeof gallery === 'string') {
      openModal('gallery', gallery)

    } else if(typeof page ==='string'){
      openModal(page, null);
    } else {
      closeModal();
    }
  }, [router.query.gallery, router.query.page, router.isReady]);

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
        zIndex: 1, height: '600vh', justifyContent: 'center',
        overflowY : 'hidden', overflowX : 'hidden' }}>

          <HeroGallery columns={columns} /> 

      </div>

      {showModal && <Modal state={modalState} onClose={ () => closeModal()} public_id={publicId} /> }
    </div>
  );
};

export default HeroPage;
