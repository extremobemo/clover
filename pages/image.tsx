import { useRouter } from 'next/router';
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
// import styles from '../styles/Image.module.css'; // Create a CSS module for styling

const ImagePage: React.FC = () => {
  const router = useRouter();
  const src = router.query;
  console.log(src.public_id)
  if (!src) {
    return <p>Loading...</p>;
  }

  const cld = new Cloudinary({ cloud: { cloudName: 'ddlip2prr' } });
  const image = cld.image(src.public_id).format('auto').quality('auto').resize(auto().gravity(autoGravity()).width(500));

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10vh' }}>
        <div style={{ maxWidth: '40%', textAlign: 'left', paddingRight: '20px' }}>
          <h2>WE THE BEST MUSIC</h2>
          <p>GATORADE!! GATORADE!! GATORADE!! GATORADE!! GATORADE!! GATORADE!! GATORADE!! GATORADE!! GATORADE!! GATORADE!! GATORADE!!</p>
        </div>
        <div style={{ width: '40%' }}>
          <AdvancedImage cldImg={image} className="advanced-image" style={{ width: '100%' }} />
        </div>
      </div>
    </div>
  );
};

export default ImagePage;
