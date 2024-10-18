import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import style from "../../styles/ScrollIndicator.module.css";

function ScrollIndicator({ scrollContainerRef }) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const scrollableWidth = container.scrollWidth - container.clientWidth;
        const scrollX = container.scrollLeft;

        const progress = scrollX / scrollableWidth;
        setScrollProgress(progress);
      }
    };

    const container = scrollContainerRef.current;

    // Attach scroll event listener to the specific scrollable container
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    // Clean up the event listener when the component unmounts
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [scrollContainerRef]);

  return (
    <motion.div 
      className={style.progressbar} 
      style={{ scaleX: scrollProgress }} 
    />
  );
}

export default ScrollIndicator;
