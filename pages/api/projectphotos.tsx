import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';
import { ProjectImageData } from '../../types/types';
import galleryDescriptions from './data/galleryDescriptions.json';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Configure Cloudinary with your credentials
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Extract the folder name from the query parameters
    const   { folder } = req.query;

    if (!folder || typeof folder !== 'string') {
      return res.status(400).json({ error: `Invalid folder name ${folder}` });
    }

    const match = folder.match(/^([^-]+)-(\d+)$/);

    if (!match || match.length !== 3) {
      return res.status(400).json({ error: `Invalid folder name format` });
    }

    const subjectName : string = match[1];
    const imageCount : number = parseInt(match[2], 10);


     // Find the gallery description that matches the folder ID
     const description = galleryDescriptions.find((desc) => desc.id === folder);

    const results: ProjectImageData[] = [];


    // Generate URLs for all images in the folder
    for (let i = 0; i < imageCount; i++) {
      const imageName = `${subjectName}-${i}`;
      results.push({
        public_id: imageName,
        url: cloudinary.url(imageName, {
          format: 'auto',
          quality: 'auto',
        }),
      });
    }

    const responseData = {
      images: results,
      description: description || { title: '', subject: '', functions: '', year: '' }
    };

    // Send the results array as JSON response
    res.status(200).json(responseData);

  } catch (error) {
    console.error('Error fetching images from Cloudinary folder:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
};

export default handler;
