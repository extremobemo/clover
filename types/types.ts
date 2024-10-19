import { CloudinaryImage } from "@cloudinary/url-gen";

export interface HeroImageData {
    public_id: string;
    url: string;
    folder: string;
    width: number;
  }

export interface ProjectImageData {
    public_id: string;
    url: string;
  }

export interface Photo {
    image: CloudinaryImage;
    folder: string;
   
      width: number,
     
  }