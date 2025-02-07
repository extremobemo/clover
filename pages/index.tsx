import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';
import Modal from '../components/HorizontalGallery/ModalGallery';
import Curtain from '../components/Curtain';
import HeroGallery from '../components/HeroGallery/HeroGallery';
import { GalleryData, GalleryGroup, HeroImageData } from '../types/types';
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

  const [allGroups, setAllGroups] = useState<GalleryGroup[]>([]);

  const [productionGroups, setProductionGroups] = useState<GalleryGroup[]>([]);

  const [videoGroups, setVideoGroups] = useState<GalleryGroup[]>([]);

  const [visibleGroups, setVisibleGroups] = useState<GalleryGroup[]>([]);

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

        const groupsResponse = await fetch('/api/groups');
        const groups : GalleryData = await groupsResponse.json();

        setAllGroups(groups.allPhotosGroups)
        setVisibleGroups(groups.allPhotosGroups);

        setProductionGroups(groups.cloverProductionsGroups);
        setVideoGroups(groups.videosGroups);
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
        setVisibleGroups(allGroups);
        break;
      case 'CLOVERPRODUCTION':
        setVisibleGroups(productionGroups);
        break;
      case 'VIDEO': //TODO: once we've created new set, utilize that.
        setVisibleGroups(videoGroups);
        break;
      default:
        setVisibleGroups(allGroups);
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

        <HeroGallery galleryGroups={visibleGroups} filterState={heroFilterState}/>

      </div>

      {showModal && <Modal state={modalState} onClose={() => closeModal()} public_id={publicId} />}
      <CloverFooterButton />
      <IndexFooterButton />
      {/* <button className={styles.invisibleFilterToggleButton} onClick={toggleFilter} disabled={showModal}/> */}
    </div>

  );
};

export default HeroPage;
