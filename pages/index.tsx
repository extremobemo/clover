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

interface Photo {
  image: CloudinaryImage;
  folder: string;
}

const HeroPage: React.FC = () => {
  let router = useRouter();

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [imageOffScreen, setImageOffScreen] = useState(false);
  const [showGreenBar, setShowGreenBar] = useState(false);

  const [showGallery, setShowGallery] = useState(false);
  const [public_id, setPublicId] = useState<string | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const cld = new Cloudinary({ cloud: { cloudName: 'ddlip2prr' } });

  // open or close gallery overlay and handle disabling or enabling background scroll
  const handleModal = (isOpening: boolean, newPublicId: string) => {
    console.log(`handle modal: isOpening = ${isOpening}, newPublicId = ${newPublicId}`)


    if (isOpening) {  
      router.push(`/?gallery=${newPublicId}`, undefined, {shallow: true});
      //ensure that showGallery is open at this point, weirdly sometimes it's not
      setShowGallery(true);
      setScrollPosition(window.scrollY);
      document.documentElement.style.overflowY = 'hidden';
    } else {
      router.push('/', undefined, { shallow: true });
      //ensure that showGallery is false at this point, weirdly sometimes it's not
      setShowGallery(false);
      document.documentElement.style.overflowY = 'auto';
      window.scrollTo(0, scrollPosition);
    }
  }

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
    console.log(`Set showGallery useEffect: url param = ${router.query.gallery} `)
    if (router.query.gallery) {
      console.log(`setting showGallery -> true`)
      setShowGallery(true);
      setPublicId(router.query.gallery as string);
    } else {
      console.log(`setting showGallery -> false`)
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

        const cloudinaryPhotos = data.map((photo: any) => {
          const cloudImage = cld.image(photo.public_id).resize(auto().width(500));
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

  const leftColumn = photos.filter((_, index) => index % 2 === 0);
  const rightColumn = photos.filter((_, index) => index % 2 !== 0);
  const columns = [leftColumn, rightColumn]

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

        {!showGallery && 
          <HeroGallery columns={columns} handleModal={handleModal} /> }
        </div>

      {showGallery && <Modal onClose={ () => handleModal(false, null)} public_id={public_id} /> }
    </div>
  );
};

export default HeroPage;
