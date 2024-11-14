import React from 'react';
import { Photo } from '../../types/types';
import HeroGalleryGroup from '../HeroGallery/HeroGalleryGroup';

interface HeroGalleryProps {
  photos: Photo[];
  heightData: number[][][];
}

const HeroGallery: React.FC<HeroGalleryProps> = ({ photos, heightData }) => {

  const firstGroup = photos.slice(0, 11); // 1
  const secondGroup = photos.slice(11, 18); // 2
  const thirdGroup = photos.slice(18, 19);
  const fourthGroup = photos.slice(19, 26); // 3
  const fifth = photos.slice(26, 27);
  const sixth = photos.slice(27, 33); // 4
  const seventh = photos.slice(33, 42); // 5
  const eigth = photos.slice(42, 47); // 6
  const ninth = photos.slice(47, 56); // 7
  const tenth = photos.slice(57, 68) // 8
  const eleventh = photos.slice(68, 75) // 8



  return (
    <div style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <HeroGalleryGroup photos={firstGroup} heightData={heightData} groupIndex={0} />

      <HeroGalleryGroup photos={secondGroup} heightData={heightData} groupIndex={1} />

      <HeroGalleryGroup photos={thirdGroup} heightData={heightData} groupIndex={0}/>

      <HeroGalleryGroup photos={fourthGroup} heightData={heightData} groupIndex={2}/>

      <HeroGalleryGroup photos={fifth} heightData={heightData} groupIndex={0}/>

      <HeroGalleryGroup photos={sixth} heightData={heightData} groupIndex={3}/>

      <HeroGalleryGroup photos={seventh} heightData={heightData} groupIndex={4}/>

      <HeroGalleryGroup photos={eigth} heightData={heightData} groupIndex={5}/>

      <HeroGalleryGroup photos={ninth} heightData={heightData} groupIndex={6}/>

      <HeroGalleryGroup photos={tenth} heightData={heightData} groupIndex={7}/>

      <HeroGalleryGroup photos={eleventh} heightData={heightData} groupIndex={7}/>

    </div>
  );
};

export default HeroGallery;
