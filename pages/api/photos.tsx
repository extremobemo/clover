import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises'; // Use fs/promises for async file operations
import path from 'path';

// Define a type for the response data
interface ImageData {
  public_id: string;
  url: string;
  folder: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Configure Cloudinary with your credentials
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Read folder names from the folders.txt file asynchronously
    const filePath = path.resolve('./public/content.txt');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const folderNames = fileContent.split(/\r?\n/).filter(Boolean);

    // Construct image URLs based on naming convention
    const results: ImageData[] = folderNames.map((folderName) => {
      // Extract the subject name and image number
      const match = folderName.match(/^([^-]+)-(\d+)$/);

      if (!match || match.length !== 3) {
        throw new Error(`Invalid folder name format: ${folderName}`);
      }

      const subjectName = match[1];
      const imageName = `${subjectName}-0`;

      console.log(folderName)
      return {
        public_id: imageName,
        url: cloudinary.url(imageName, {
          format: 'jpg',
          quality: '1',
        }),
        folder: folderName,
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
