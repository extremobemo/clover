import { useRouter } from 'next/router';
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { quality } from '@cloudinary/url-gen/actions/delivery';
import { useEffect, useState } from 'react';
const cld = new Cloudinary({ cloud: { cloudName: 'ddlip2prr' } });

const ImagePage: React.FC = () => {
  const router = useRouter();
  const { public_id } = router.query;
  const [photos, setPhotos] = useState<CloudinaryImage[]>([]);

  useEffect(() => {
    if (typeof public_id !== 'string') return;

    const folder = public_id; // Adjust folder name as per your needs
    console.log(folder)
    fetch(`/api/projectphotos?folder=${folder}`)
      .then(response => response.json())
      .then(data => {
        const cloudinaryImages = data.map((photo: any) =>
          cld.image(photo.public_id).format('auto').quality('auto').resize(auto().gravity(autoGravity()).width(500))
        );
        setPhotos(cloudinaryImages);
      })
      .catch(error => console.error('Error:', error));
  }, [public_id, cld]);

  if (typeof public_id !== 'string') {
    return <p>Loading...</p>;
  }

  const image = cld.image(public_id).format('auto').quality('80').resize(auto().gravity(autoGravity()).width(2500));

  return (
    <div style={{ display: 'flex', overflowX: 'auto'}}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'left', paddingRight: '20px', overflowY: 'auto', width:  '40vw', wordWrap: 'break-word' }}>
          <h2>WE THE BEST MUSIC</h2>
          <p>GATORADE!! GATORADE!! GATORADE!! GATORADE!! GATORADE!! GATORADE!! GATORADE!! GATORADE!! GATORADE!! GATORADE!! GATORADE!!</p>
        </div>
        
          {photos.map((photo, index) => (
            <div key={index} style={{ minWidth: '40vw', marginRight: '20px' }}>
              <AdvancedImage cldImg={photo} className="advanced-image" style={{ height: '80vh' }} />
            </div>
          ))}
      </div>
    </div>
  );
  
};

export default ImagePage;
