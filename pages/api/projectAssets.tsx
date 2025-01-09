import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';
import { Video } from '../../types/types';
import galleryDescriptions from './data/galleryDescriptions.json';
import cloudinaryResources from './data/cloudinaryResourcesByFolder.json' assert { type: 'json' };

interface Resource {
  asset_folder: string;
  public_id: string;
  resource_type: 'image' | 'video'; // Define possible resource types
  [key: string]: any; // Allow additional properties that we might not care about
}

interface Folder {
  photos: string[]; // Array of photo public IDs
  videos: Video[]; // Array of video objects with publicId, width, and height
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
      return res.status(400).json({ error: `Invalid folder name ${folder}` });
    }

    const description = galleryDescriptions.find((desc) => desc.id === folder);

    const typedCloudinaryResources: Record<string, Folder> = cloudinaryResources;

    const assetFolder = typedCloudinaryResources[folder];

    if (!assetFolder) {
      return res.status(404).json({ error: 'Folder not found in resources.' });
    }

    let photoPublicIds: string[] = assetFolder.photos;
    let videoData: Video[] = assetFolder.videos;
    let count = 0;

    photoPublicIds.sort();
    videoData.sort((a, b) => a.publicId.localeCompare(b.publicId));

    const responseData = {
      imagePublicIds: photoPublicIds,  // Only the public IDs of the photos
      videos: videoData,  // Array of video data objects with publicId, width, and height
      assetCount: count,
      description: description || { title: '', subject: '', functions: '', year: '' },
    };

    responseData.imagePublicIds = photoPublicIds.filter(id => !id.includes("_GIF"));

    // Send the results array as JSON response
    res.status(200).json(responseData);

  } catch (error) {
    console.error('Error fetching images from Cloudinary folder:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
};

export default handler;
