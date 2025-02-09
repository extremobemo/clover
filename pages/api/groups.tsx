import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises'; // Use fs/promises for async file operations
import path from 'path';
import { ProjectImageData } from '../../types/types';
import galleryGroups from './data/HeroGalleryGroups.json' assert { type: 'json' };

import { GalleryData } from '../../types/types';



const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Configure Cloudinary with your credentials
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const data : GalleryData = galleryGroups;
    

    // Send the results array as JSON response
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching images from Cloudinary folders:', error);
    res.status(500).json({ error: 'failed to load gallery data' });
  }
};

export default handler;
