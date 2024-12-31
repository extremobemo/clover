import { CloudinaryImage } from "@cloudinary/url-gen";

export interface HeroImageData {
    public_id: string;
    url: string;
    folder: string;
  }

export interface ProjectImageData {
    public_id: string;
    url: string;
  }

export interface Photo {
    image: CloudinaryImage;
    folder: string;
  }

export interface Video {
    publicId: string;
    width: number;
    height: number;
  }