import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Recreate `__dirname`
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: '',
  api_key: '',
  api_secret: ''
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

    const videos = [];
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
        const width = resource.width;
        const height = resource.height;
        folderDictionary[folderName].videos.push({ publicId, width, height });
      }
    });

    // Sort photos based on numeric suffix
    for (const folder in folderDictionary) {
      folderDictionary[folder].photos.sort((a, b) => {
        const getNumericSuffix = (id) => {
          // Extract the trailing number using a regex
          const match = id.match(/(\d+)$/); // Matches numbers at the end of the string
          return match ? parseInt(match[1], 10) : 0; // Default to 0 if no number is found
        };

        const aNumber = getNumericSuffix(a);
        const bNumber = getNumericSuffix(b);

        return aNumber - bNumber; // Compare the numeric suffixes
      });
    }

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
