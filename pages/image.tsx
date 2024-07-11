// pages/image.js
import Image from 'next/image';
import { useRouter } from 'next/router';
import PageTransition from "../components/PageTransition";

const ImagePage = () => {
  const router = useRouter();
  const { src } = router.query;

  // Decode base64 data URI to get the original image URL
  const decodedSrc = src ? Buffer.from(src as string, 'base64').toString() : null;

  if (!decodedSrc) {
    console.log('Error: Image source not found. Router query:', router.query);
    return (
      <div>
        <p>Error: Image source not found.</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: 'auto',
      marginBottom: 'auto',
      // justifyContent: 'center',
      // alignItems: 'center',
      width: '60vh', // Ensure the image is centered vertically
      
    }}>
      <PageTransition>
        <Image
          src={decodedSrc}
          alt="Clicked Image"
          objectFit="contain"
          layout="responsive"
          width={400}
          height={200}
        />
      </PageTransition>
    </div>
  );
};

export default ImagePage;
