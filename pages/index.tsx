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
import CloverFooterButton from '../components/common/CloverFooterButton'
import styles from '../styles/Index.module.css'
import cloverProductions from './cloverProductions.json'
import heightData from '../data/heightData'
import IndexFooterButton from '../components/common/IndexFooterButton';

interface Photo {
  image: CloudinaryImage;
  folder: string;
}

const FilteredSet  = new Set(
[
  ...cloverProductions  
]);

const allPhotosHeightData = heightData.allPhotosHeightData;

const filteredPhotosHeightData = heightData.filteredPhotosHeightData;


const HeroPage: React.FC = () => {
  const router = useRouter();
  const { showModal, modalState, publicId, openModal, closeModal } = useModal();

  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);
  const [productionPhotos, setProductionPhotos] = useState<Photo[]>([]);
  const [visiblePhotos, setVisiblePhotos] = useState<Photo[]>([]);

  const [heightData, setHeightData] = useState<number[][][]>(allPhotosHeightData);

  const [isFiltered, setIsFiltered] = useState<Boolean>(false);

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
          const cloudImage : CloudinaryImage = cld.image(photo.public_id).resize(auto().width(1000));
          return {
            image: cloudImage,
            folder: photo.folder,
          };
        });

        setAllPhotos(cloudinaryPhotos);
       
        let filteredPhotos = cloudinaryPhotos.filter(photo => FilteredSet.has(photo.folder));
        setProductionPhotos(filteredPhotos);

        //initialize photos to display as all photos
        setVisiblePhotos(cloudinaryPhotos);

        setHeightData(allPhotosHeightData);
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    };

    fetchPhotos();
  }, []);

  const toggleFilter = () =>
  {
    if(isFiltered){
      setVisiblePhotos(allPhotos)
      setHeightData(allPhotosHeightData)
    }
    else{
      setVisiblePhotos(productionPhotos)
      setHeightData(filteredPhotosHeightData)
    }

    setIsFiltered(!isFiltered);
  }
  

  return (
    <div id="outermost_div"
      style={{ display: 'flex', justifyContent: 'center',
      overflowY: 'hidden', height: '100dvh', overflowX: 'hidden'}} >

      {!imageOffScreen && (
        <Curtain imageOffScreen={imageOffScreen} setImageOffScreen={setImageOffScreen} setShowGreenBar={setShowGreenBar}/>
      )}

      {/* {showGreenBar && (<GreenBar text="CLOVER." />)} */}
      
      <div id="content_div" style={{
        display: 'flex',
        position: 'absolute',
        zIndex: 1,
        justifyContent: 'center',
        overflowY: 'hidden',
        overflowX: 'hidden',
        width: '100vw',
        maxWidth: '100vw',
      }}>

        <HeroGallery photos={visiblePhotos} heightData={heightData} /> 

      </div>

      {showModal && <Modal state={modalState} onClose={ () => closeModal()} public_id={publicId} /> }
      <CloverFooterButton/>
      <IndexFooterButton/>
      <button className={styles.invisibleFilterToggleButton} onClick={toggleFilter} disabled={showModal}/>
    </div>
    
  );
};

export default HeroPage;
