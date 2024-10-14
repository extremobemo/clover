import { motion, MotionValue } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/ScrollIndicator.module.css";

interface ScrollIndicatorProps {
  scrollXProgress?: MotionValue<number>;
}

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ scrollXProgress }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [clipPaths, setClipPaths] = useState({
    base: "inset(0 100% 0 0)",
    bar: "inset(0 100% 0 0)",
  });

  const updateClipPaths = () => {
    if (scrollXProgress && containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const progress = scrollXProgress.get();
      const trailingEdge = containerWidth * progress;

      setClipPaths({
        base: `inset(0 ${containerWidth - trailingEdge}px 0 0)`,
        bar: `inset(0 0 0 0)`,
      });
    }
  };

  useEffect(() => {
    if (scrollXProgress) {
      updateClipPaths();
      const unsubscribe = scrollXProgress.onChange(updateClipPaths); // Subscribe to changes

      // Update clip paths on window resize
      const handleResize = () => {
        updateClipPaths();
      };
      window.addEventListener("resize", handleResize);

      return () => {
        unsubscribe(); // Cleanup on unmount
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [scrollXProgress]);

  return (
    <div ref={containerRef} className={styles.scrollIndicatorContainer}>
      <motion.div className={styles.progressbar} style={{ scaleX: scrollXProgress || 0, backgroundColor: '#39993A' }} />

      <motion.div className={styles.textOverlayContainer} style={{ clipPath: clipPaths.base }}>
        <div className={styles.bottomLeftOverlay} style={{ clipPath: clipPaths.bar }}>INDEX</div>
        <div className={styles.bottomCenterOverlay} style={{ clipPath: clipPaths.bar }}>PRODUCTION</div>
        <div className={styles.bottomRightOverlay} style={{ clipPath: clipPaths.bar }}>CLOVER</div>
      </motion.div>

      <div className={styles.bottomLeftBase}>INDEX</div>
      <div className={styles.bottomCenterBase}>PRODUCTION</div>
      <div className={styles.bottomRightBase}>CLOVER</div>
    </div>
  );
};

export default ScrollIndicator;
