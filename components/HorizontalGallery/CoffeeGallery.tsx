import React, { useState } from "react"
import styles from "../../styles/HorizontalGallery.module.css"
import GalleryDescription from './GalleryDescription'

import ScrollIndicator from "../common/ScrollIndicator";
import PageTransition from "../common/PageTransition";

import { Video } from "../../types/types";

import { useScroll } from "framer-motion";
import { useRef } from "react";
import { AdvancedImage } from '@cloudinary/react';
import { CldVideoPlayer, CloudinaryVideoPlayer } from "next-cloudinary";
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { useEffect } from 'react';

const cld = new Cloudinary({ cloud: { cloudName: 'ddlip2prr' } });

import {
  motion,
} from "framer-motion"

interface CoffeeGalleryProps {
  public_id: string | null
}

const CoffeeGallery: React.FC<CoffeeGalleryProps> = ({ public_id }) => {

  var expectedPhotos = 3;
  if (public_id) {
    // Read # of expected photos from folder name
    expectedPhotos = parseInt((public_id as string).split('-')[1], 10);
  }

  const [aspectRatio, setAspectRatio] = useState(16 / 9); // Default to 16:9

  const [videos, setVideos] = useState<Video[]>([]);

  const [photos, setPhotos] = useState<CloudinaryImage[]>([]);
  const [description, setDescription] = useState(
    {
      title: '',
      subject: '',
      functions: '',
      year: '',
    }
  );

  useEffect(() => {
    if (typeof public_id !== 'string') return;
    const folder = public_id;
    console.log(`folder name: ${folder}`)
    fetch(`/api/projectAssets?folder=${folder}`)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        const cloudinaryImages = data.imagePublicIds.map((public_id: any) =>
          cld.image(public_id).format('auto').quality('auto').resize(auto().height(750))
        );
        setPhotos(cloudinaryImages);
        setVideos(data.videos);
        setDescription(data.description);
      })
      .catch(error => console.error('Error:', error));
  }, [public_id, cld]);

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      // Check if scrolling vertically
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
        const scrollContainer = document.getElementById("scroll-container");
        if (scrollContainer) {
          scrollContainer.scrollLeft += e.deltaY;
        }
      }
    };

    window.addEventListener("wheel", handleScroll);

    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, []);

  const preventRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
  }

  const isMobile = window.innerWidth <= 768;
  const carouselRef = useRef(null); // Create a ref for the scrollable element
  const { scrollXProgress } = useScroll({
    container: carouselRef
  });

  const [loading, setLoading] = useState(false);
  const loadedPhotos = useRef(0);

  useEffect(() => {
    // Reset loading state if photos array changes
    loadedPhotos.current = 0;
    // setLoading(true);
  }, [photos]);

  const handlePhotoLoad = () => {
    loadedPhotos.current += 1;
    if (loadedPhotos.current >= photos.length) {
      setLoading(false); // Only switch to false when all photos are loaded
    }
  };

  return (
    <>
      {/* Only show scroll indicator once loading is complete */}
      {true && <ScrollIndicator scrollXProgress={scrollXProgress} />}

      {loading && <ScrollIndicator />}
      <div style={{ overflowY: 'hidden', overflowX: 'scroll', height: '100dvh' }} id="scroll-container" ref={carouselRef}>
        <PageTransition>
          {/* adding this motion.section seemed to help with glitchy loading */}
          <motion.section className={styles.thumbnailscontainer}

            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: .3  //delay between children loading
                }
              }
            }}>
            <div className={styles.anotherContainer}>
              <div className={styles.thumbnails}>

                <div className={styles.coffeeTextContainer}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    maxHeight: isMobile ? '45dvh' : '60dvh',
                    textAlign: 'center',
                  }}>
                  {/* <p style={{ textAlign: 'center' }}> */}
                    Clover Coffee is a creative project launched in 2022. Inspired by their love for New York City's vibrant coffee culture,
                    Cian and his team set out to create a space where people could gather, play chess, and enjoy great coffee in a laid-back, community-driven environment.
                    <br /> <br />
                    Taking an old halal food cart and transforming it into a unique mobile coffee experience, Clover Coffee is a testament to the agency’s DIY ethos. 
                    Designed and built in-house, this self-funded, self-sustained project has evolved into an enterprise in its own right.
                    <br /> <br />
                    Whether its parked on a bustling New York City street corner or popping 
                    up at local events, Clover Coffee brings a fresh,
                     creative twist to the citys coffee scene one cup at a time.
                  {/* </p> */}
                </div>

            

                {photos.map((photo, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }} // start invisible, slide in from left
                    animate={{ opacity: 1, x: 0 }} // final opacity to 1, slide into final x position
                    transition={{ duration: 0.5, delay: index * 0.1 }} // duration: speed of opacity 0 -> 100, delay: speed of sequential image rendering
                    // whileHover={{ scale: 1.1 }}  
                    style={{ placeContent: 'center' }}>
                    <div className={styles.thumbnail} key={index}>
                      <AdvancedImage cldImg={photo} style={{ maxHeight: isMobile ? '45dvh' : '60dvh' }} onContextMenu={preventRightClick} onLoad={handlePhotoLoad} />
                    </div>
                  </motion.div>
                ))}
                   {videos.map((video, index) =>
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    style={{
                      placeContent: 'center',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{
                      width: isMobile ? `calc(45dvh *  ${aspectRatio})` : `calc(60dvh *  ${aspectRatio})`,
                      maxWidth: `calc(750px * ${aspectRatio})`,
                      maxHeight: '750px',
                      height: 'auto'
                    }}
                      className={styles.thumbnail} key={index}>
                      <CldVideoPlayer
                        src={video.publicId}
                        onMetadataLoad={({ player }: any) => {
                          const videoElement = player?.videoElement;
                          if (videoElement) {
                            const ratio = video.width / video.height;
                            setAspectRatio(ratio);
                          }
                        }}
                      />
                    </div>
                  </motion.div>
                )}
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}>
                <GalleryDescription
                  title={description.title}
                  subject={description.subject}
                  functions={description.functions}
                  year={description.year} />
              </motion.div>
            </div>

          </motion.section>

        </PageTransition>
      </div>
    </>
  );


}

export default CoffeeGallery
