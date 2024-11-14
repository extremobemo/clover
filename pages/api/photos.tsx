import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises'; // Use fs/promises for async file operations
import path from 'path';
import { ProjectImageData } from '../../types/types';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Configure Cloudinary with your credentials
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Read folder data from the content.json file asynchronously
    const filePath = path.resolve('./public/content.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const folderData = JSON.parse(fileContent); // Parse the JSON data

    // Construct image URLs based on the JSON data
    const results: ProjectImageData[] = folderData.map(({ public_id, folder }: { public_id: string; folder: string }) => {
      return {
        public_id,
        url: cloudinary.url(public_id, {
          format: 'jpg',
          quality: '1',
        }),
        folder,
      };
    });

    // Send the results array as JSON response
    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching images from Cloudinary folders:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
};

export default handler;
