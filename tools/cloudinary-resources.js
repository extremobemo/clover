import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Recreate `__dirname`
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const fetchData = async () => {
    try {
  
      const images = [];
      let imageCursor = null;
      do {
        const result = await cloudinary.api.resources({
          max_results: 500, // Maximum allowed value
          resource_type: 'video',
          next_cursor: imageCursor,
        });
    
        images.push(...result.resources);
        imageCursor = result.next_cursor;
      } while (imageCursor);
  
      const videos = []
      let videoCursor = null;
      do {
        const result = await cloudinary.api.resources({
          max_results: 500, // Maximum allowed value
          resource_type: 'image',
          next_cursor: videoCursor,
        });
    
        images.push(...result.resources);
        videoCursor = result.next_cursor;
      } while (videoCursor);
  
      const allAssets = [...images, ...videos];
  
      const folderDictionary = {};
  
      allAssets.forEach((resource) => {
        const folderName = resource.asset_folder;
        const publicId = resource.public_id;
        const resourceType = resource.resource_type;
    
        if (!folderDictionary[folderName]) {
          folderDictionary[folderName] = { photos: [], videos: [] };
        }
    
        if (resourceType === 'image') {
          folderDictionary[folderName].photos.push(publicId);
        } else if (resourceType === 'video') {
          folderDictionary[folderName].videos.push(publicId);
        }
      });
  
  
      // Output data to a JSON file
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0]; // Extracts YYYY-MM-DD from ISO string
      const outputFilePath = path.resolve(__dirname, `cloudinary-resources-${formattedDate}.json`);
      fs.writeFileSync(outputFilePath, JSON.stringify(folderDictionary, null, 2));
  
      console.log(`Data successfully written to ${outputFilePath}`);
    } catch (error) {
      console.error('Error fetching images from Cloudinary folder:', error);
    }
  };
  
  fetchData();