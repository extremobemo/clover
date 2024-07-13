import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Configure Cloudinary with your credentials
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Fetch root folders from Cloudinary
    const { folders } = await cloudinary.api.root_folders();

    // Array to store results
    const results = [];

    // Loop through each folder and fetch one image from each
    for (const folder of folders) {
      // Construct a search query for one image in the folder
      const searchQuery = cloudinary.search
        .expression(`folder:${folder.name}/`)
        .max_results(1) // Fetch only one image per folder
        .execute();

      // Await the search query execution
      const result = await searchQuery;
      if (result.resources.length > 0) {
        // Push the first resource (image) found to the results array
        results.push(result.resources[0]);
      }
      console.log(result)
    }

    // Send the results array as JSON response
   
    res.status(200).json(results);

  } catch (error) {
    console.error('Error fetching images from Cloudinary folders:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
};

export default handler;
