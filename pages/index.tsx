import React, { useState, useEffect, ForwardedRef } from 'react';
import CurtainComponent from '../components/index/curtain';
interface GalleryPageProps { }



const GalleryPage: React.FC<GalleryPageProps> = React.forwardRef((props, ref: ForwardedRef<HTMLDivElement>) => {

 
  return (
    <div style={{ height: '200vh', overflowY: 'auto' }}>
      <CurtainComponent/>
    </div>
  );
});

export default GalleryPage;
