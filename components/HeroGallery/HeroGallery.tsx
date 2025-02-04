import React from 'react';
import { Photo } from '../../types/types';
import HeroGalleryGroup from '../HeroGallery/HeroGalleryGroup';

interface HeroGalleryProps {
  photos: Photo[];
  heightData: number[][][];
  filterState: String;
}

interface GroupConfig {
  start: number;
  end: number;
  groupIndex: number;
}

const HeroGallery: React.FC<HeroGalleryProps> = ({ photos, heightData, filterState }) => {

  let groupConfigs: GroupConfig[] = [];
  console.log("Photos displayed")
  console.log(photos)
  if (filterState === 'ALL') {
    groupConfigs = [
      { start: 0, end: 11, groupIndex: 0 },
      { start: 11, end: 18, groupIndex: 1 },
      { start: 18, end: 19, groupIndex: 0 },
      { start: 19, end: 26, groupIndex: 2 },
      { start: 26, end: 27, groupIndex: 0 },
      { start: 27, end: 33, groupIndex: 3 },
      { start: 33, end: 42, groupIndex: 4 },
      { start: 42, end: 47, groupIndex: 5 },
      { start: 47, end: 56, groupIndex: 6 },
      { start: 57, end: 68, groupIndex: 7 },
      { start: 68, end: 75, groupIndex: 7 },
    ];
  } else if (filterState === 'CLOVERPRODUCTION') {
    groupConfigs = [
      { start: 0, end: 5, groupIndex: 0 },
      { start: 6, end: 13, groupIndex: 1 },
      { start: 13, end: 18, groupIndex: 2 },
      { start: 5, end: 6, groupIndex: 4 },
    ];
  } else if (filterState === 'VIDEO') {
    groupConfigs = [
      { start: 0, end: 5, groupIndex: 0 },
      { start: 5, end: 10, groupIndex: 1 },
      { start: 10, end: 17, groupIndex: 2},
      { start: 17, end: 18, groupIndex: 3 },
    ];
  }
  
  const groups = groupConfigs.map(({ start, end, groupIndex }) => ({
    photos: photos.slice(start, end),
    groupIndex,
  }));
console.log("Groups")
console.log(groups)

  return (
    <div style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      {groups.map((group, index) => (
        <HeroGalleryGroup
          key={index}
          photos={group.photos}
          heightData={heightData}
          groupIndex={group.groupIndex}
          filterState={filterState}
        />
      ))}
    </div>
  );
};

  

export default HeroGallery;
