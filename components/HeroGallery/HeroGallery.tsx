import React from 'react';
import { Photo } from '../../types/types';
import HeroGalleryGroup from '../HeroGallery/HeroGalleryGroup';

interface HeroGalleryProps {
  photos: Photo[];
  heightData: number[][][];
}

const HeroGallery: React.FC<HeroGalleryProps> = ({ photos, heightData }) => {
  // Split the photos array into two arrays
  const firstTenPhotos = photos.slice(0, 10);
  const remainingPhotos = photos.slice(10, 17);
  const remainingRemainingPhotos = photos.slice(13);

  return (
    <div>
      {/* Pass the first 10 photos to the first HeroGalleryGroup */}
      <HeroGalleryGroup photos={firstTenPhotos} heightData={heightData} />

      {/* Pass the remaining photos to the second HeroGalleryGroup */}
      <HeroGalleryGroup photos={remainingPhotos} heightData={heightData} />

      <HeroGalleryGroup photos={remainingRemainingPhotos} heightData={heightData} />
    </div>
  );
};

export default HeroGallery;
