import React, { useRef, useState, useEffect } from "react";
import { AdvancedImage } from "@cloudinary/react";

interface ImageWithOverlayProps {
  photo: any;
  height?: string;
  cldImg: any;
  getGalleryTitles: (folderName: string) => React.ReactNode;
  openModal: (type: string, folderName: string) => void;
  preventRightClick: (e: React.MouseEvent) => void;
  className?: string;
  overlayClass?: string;
  style?: React.CSSProperties;
}

const ImageWithOverlay: React.FC<ImageWithOverlayProps> = ({
  photo,
  height,
  cldImg,
  getGalleryTitles,
  openModal,
  preventRightClick,
  className,
  overlayClass,
  style
}) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [imgWidth, setImgWidth] = useState<number>(0);

  useEffect(() => {
    const updateWidth = () => {
      if (imgRef.current) {
        setImgWidth(imgRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <div style={{ height }} className={className}>
      <AdvancedImage
        ref={imgRef}
        onClick={() => openModal("gallery", photo.folderName)}
        onContextMenu={preventRightClick}
        cldImg={cldImg}
        style={{ height: "100%", ...style }}
      />
      <div className={overlayClass} style={{ width: imgWidth }}>
        {getGalleryTitles(photo.folderName)}
      </div>
    </div>
  );
};

export default ImageWithOverlay;
