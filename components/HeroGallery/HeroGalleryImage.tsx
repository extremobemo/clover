import React, { useState } from 'react';
import { AdvancedImage } from '@cloudinary/react';
import { CloudinaryImage } from '@cloudinary/url-gen';

interface HeroGalleryImageProps {
  photo: any; // Replace 'any' with actual type if available
  generateUrl: (publicId: string) => CloudinaryImage;
  openModal: (type: string, folderName: string) => void;
  preventRightClick: (e: React.MouseEvent) => void;
  getGalleryTitles: (folderName: string) => JSX.Element;
  styles: any; // Replace 'any' with actual type if available
  overlayStyles: any; // Replace 'any' with actual type if available
  imageWrapperStyle?: React.CSSProperties;
  imageStyle?: React.CSSProperties;
}

const HeroGalleryImage: React.FC<HeroGalleryImageProps> = ({
  photo,
  generateUrl,
  openModal,
  preventRightClick,
  getGalleryTitles,
  styles,
  overlayStyles,
  imageWrapperStyle,
  imageStyle,
}) => {
  const [overlayWidth, setOverlayWidth] = useState<number | null>(null);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);

  return (
    <div className={overlayStyles.imageWrapper} style={imageWrapperStyle}>
      <AdvancedImage
        onClick={() => openModal('gallery', photo.folderName)}
        onContextMenu={preventRightClick}
        cldImg={generateUrl(photo.publicId)}
        className={styles.clickablePhoto}
        style={imageStyle}
        onMouseOver={(e) => {
          setOverlayWidth(e.currentTarget.offsetWidth);
          setShowOverlay(true);
        }}
        onMouseOut={() => {
          setShowOverlay(false);
          setOverlayWidth(null);
        }}
      />
      <div className={overlayStyles.overlay} style={{ width: overlayWidth ? `${overlayWidth}px` : '100%', opacity: showOverlay ? 1 : 0 }}>
        {getGalleryTitles(photo.folderName)}
      </div>
    </div>
  );
};

export default HeroGalleryImage;
