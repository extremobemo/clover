import React from 'react';
import { GalleryGroup, Photo } from '../../types/types';
import HeroGalleryGroup from '../HeroGallery/HeroGalleryGroup';

interface HeroGalleryProps {
  galleryGroups: GalleryGroup[];
  filterState: string;
}

const HeroGallery: React.FC<HeroGalleryProps> = ({ galleryGroups , filterState }) => {
  return (
    <div style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      {galleryGroups.map((group, index) => (
        <HeroGalleryGroup
          key={index}
          group={group}
          groupIndex={index}
          filterState={filterState}
        />
      ))}
    </div>
  );
};

  

export default HeroGallery;
