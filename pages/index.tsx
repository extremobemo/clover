import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { scale } from '@cloudinary/url-gen/actions/resize';

import PageTransition from "../components/common/PageTransition";
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import Modal from '../components/HorizontalGallery/ModalGallery';
import Curtain from '../components/Curtain';
import HeroGallery from '../components/HeroGallery/HeroGallery';
import { HeroImageData } from '../types/types';
import { useAppContext } from '../context/AppContext';
import CloverFooterButton from '../components/common/CloverFooterButton'
import styles from '../styles/Index.module.css'

import cloverProductions from './cloverProductions.json'
import cloverVideos from './cloverVideos.json'

import heightData from '../data/heightData'
import IndexFooterButton from '../components/common/IndexFooterButton';
import ScrollIndicator from '../components/common/ScrollIndicator';
import { useScroll } from "framer-motion";

interface Photo {
  image: CloudinaryImage;
  folder: string;
}

const CloverProductionsSet = new Set([ ...cloverProductions ]);
const CloverVideosSet = new Set([ ...cloverVideos ]);

const allPhotosHeightData = heightData.allPhotosHeightData;
const productionPhotosHeightData = heightData.productionPhotosHeightData;
const videoPhotosHeightData = heightData.videoPhotosHeightData;

const HeroPage: React.FC = () => {
  const router = useRouter();
  const { showModal, modalState, publicId, openModal, closeModal, heroFilterState } = useAppContext();

  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);

  const [productionPhotos, setProductionPhotos] = useState<Photo[]>([]);
  const [videoPhotos, setVideoPhotos] = useState<Photo[]>([]);

  const [visiblePhotos, setVisiblePhotos] = useState<Photo[]>([]);

  const [heightData, setHeightData] = useState<number[][][]>(allPhotosHeightData);

  const [imageOffScreen, setImageOffScreen] = useState<boolean>(false);

  const cld = new Cloudinary({ cloud: { cloudName: 'ddlip2prr' } });

  const { scrollYProgress } = useScroll()

  //when router is ready, grab arguments from router to determine which modal to display. This helps us with browser navigation stuff. 
  useEffect(() => {
    //TODO: will need to scrub the url param to handle invalid args

    if (!router.isReady) return; // Wait until the router is ready

    const gallery = router.query.gallery;
    const page = router.query.page;
    if (typeof gallery === 'string') {
      openModal('gallery', gallery)

    } else if (typeof page === 'string') {
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

        const cloudinaryPhotos: Photo[] = data.map((photo: HeroImageData) => {
          const cloudImage: CloudinaryImage =
            photo.public_id.includes('_GIF')
              ? cld.image(photo.public_id).resize(auto())
              : cld.image(photo.public_id).resize(auto().width(1000));
          return {
            image: cloudImage,
            folder: photo.folder,
          };
        });

        setAllPhotos(cloudinaryPhotos);

        let productionPhotos = cloudinaryPhotos.filter(photo => CloverProductionsSet.has(photo.folder));
        setProductionPhotos(productionPhotos);

        let videoPhotos = cloudinaryPhotos.filter(photo => CloverVideosSet.has(photo.folder));
        setVideoPhotos(videoPhotos);

        //TODO: once we have videos, will need to create a set of folder names kinda like we've got for CloverProductions 
        // and use that to create the video set

        //initialize photos to display as all photos
        setVisiblePhotos(cloudinaryPhotos);

        setHeightData(allPhotosHeightData);
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    };

    fetchPhotos();
  }, []);

  //might need a use effect for the heroFilterState
  useEffect(() => {
    console.log(`heroFilterState updated: ${heroFilterState}`)
    switch (heroFilterState) {
      case 'ALL':
        setVisiblePhotos(allPhotos);
        setHeightData(allPhotosHeightData);
        break;
      case 'CLOVERPRODUCTION':
        setVisiblePhotos(productionPhotos);
        setHeightData(productionPhotosHeightData);
        setVisiblePhotos(productionPhotos)
        break;
      case 'VIDEO': //TODO: once we've created new set, utilize that.
        setVisiblePhotos(videoPhotos);
        setHeightData(videoPhotosHeightData);
        setVisiblePhotos(videoPhotos)
        break;
      default:
        setVisiblePhotos(allPhotos);
        setHeightData(allPhotosHeightData);
        break;
    }
    scrollTo(0,0)
  }, [heroFilterState])

  return (
    <div id="outermost_div"
      style={{
        display: 'flex', justifyContent: 'center',
        overflowY: 'hidden', height: '100dvh', overflowX: 'hidden'
      }} >

      {!imageOffScreen && (
        <Curtain imageOffScreen={imageOffScreen} setImageOffScreen={setImageOffScreen} />
      )}

      <ScrollIndicator scrollXProgress={scrollYProgress} />

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

        <HeroGallery photos={visiblePhotos} heightData={heightData} filterState={heroFilterState} />

      </div>

      {showModal && <Modal state={modalState} onClose={() => closeModal()} public_id={publicId} />}
      <CloverFooterButton />
      <IndexFooterButton />
      {/* <button className={styles.invisibleFilterToggleButton} onClick={toggleFilter} disabled={showModal}/> */}
    </div>

  );
};

export default HeroPage;
