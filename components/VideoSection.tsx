import { useEffect } from 'react';
import { motion, useAnimation, useViewportScroll } from 'framer-motion';

export default function VideoSection() {
  const controls = useAnimation();
  const { scrollY } = useViewportScroll();

  useEffect(() => {
    const updatePosition = () => {
      controls.start({
        y: -scrollY.get(),
        transition: { ease: 'linear', duration: 0 },
      });
    };

    const unsubscribe = scrollY.onChange(updatePosition);

    return () => {
      unsubscribe();
    };
  }, [controls, scrollY]);

  return (
    <motion.div
      className="absolute top-0 left-0 w-full h-screen overflow-hidden z-50"
      animate={controls}
      initial={{ y: 0 }}
    >
      <video
        autoPlay
        muted
        loop
        className="w-full h-full object-cover"
        src="/bts.mp4"
      />
    </motion.div>
  );
}