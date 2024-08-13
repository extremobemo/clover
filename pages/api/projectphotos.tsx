import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';

interface ImageData {
  public_id: string;
  url: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Configure Cloudinary with your credentials
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Extract the folder name from the query parameters
    const { folder } = req.query;

    if (!folder || typeof folder !== 'string') {
      return res.status(400).json({ error: 'Invalid folder name' });
    }

    const match = folder.match(/^([^-]+)-(\d+)$/);

    if (!match || match.length !== 3) {
      return res.status(400).json({ error: 'Invalid folder name format' });
    }

    const subjectName = match[1];
    const imageCount = parseInt(match[2], 10);

    const results: ImageData[] = [];


    // Generate URLs for all images in the folder
    for (let i = 0; i < imageCount; i++) {
      const imageName = `${subjectName}-${i}`;
      results.push({
        public_id: imageName,
        url: cloudinary.url(imageName, {
          format: 'jpg',
          quality: 'auto',
        }),
      });
    }
    // Send the results array as JSON response
    res.status(200).json(results);

  } catch (error) {
    console.error('Error fetching images from Cloudinary folder:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
};

export default handler;
