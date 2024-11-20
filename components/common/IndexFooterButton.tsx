import { useState, useRef, useEffect } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import styles from '../../styles/IndexFooter.module.css';
import { useModal } from '../../context/ModalContext';

const menuVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 20, // Start slightly below
      x: -10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0, // Move to its final position
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      x: -10,
      transition: { duration: 0.2 },
    },
  };


export default function IndexFooterButton() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { openModal } = useModal();
  const menuRef = useRef<HTMLDivElement>(null); // Typed ref for the menu container

  

  const toggleMenu = () => setMenuOpen(!isMenuOpen);

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className={styles.footerContainer} ref={menuRef}>
        <AnimatePresence>
        {isMenuOpen && (
        <motion.div
        className={styles.menu}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={menuVariants}>
            <div className={styles.menu}>
                <motion.div 
                    whileHover={{ scale: 1.1, x: 3 }}
                 className={styles.menuItem}>PRODUCTION</motion.div>
                <motion.div  whileHover={{ scale: 1.1, x: 3 }} className={styles.menuItem}>VIDEO</motion.div>
                <motion.div whileHover={{ scale: 1.1, x: 3 }} className={styles.menuItem}>ALL</motion.div>
            </div>
        </motion.div>
            
      )}
        </AnimatePresence>
      
      <button className={styles.footerButton} onClick={toggleMenu}>
      {/* keep this bih empty */}
      </button>
    </div>
  );
}
