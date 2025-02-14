import { useState, useRef, useEffect, use } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import styles from '../../styles/CloverFooter.module.css';
import { useAppContext } from '../../context/AppContext';

const menuVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 20, // Start slightly below
    x: 10,
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
    x: 10,
    transition: { duration: 0.2 },
  },
};


export default function CloverFooterButton() {
  const { openModal, showCloverMenuInitially } = useAppContext();

  const [isMenuOpen, setMenuOpen] = useState(showCloverMenuInitially);
 
  const menuRef = useRef<HTMLDivElement>(null); // Typed ref for the menu container
  const toggleMenu = () => setMenuOpen(!isMenuOpen);

  useEffect(() => {
    setMenuOpen(showCloverMenuInitially)
  }, [showCloverMenuInitially])

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    //don't add this listener when we're trying to show users where menus are
    if (isMenuOpen && !showCloverMenuInitially) {
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
              <motion.div whileHover={{ scale: 1.1, x: -3 }} className={styles.menuItem} onClick={() => { openModal('about', null); setMenuOpen(false) }}>INFO/CONTACT</motion.div>
              <motion.div whileHover={{ scale: 1.1, x: -3 }} className={styles.menuItem} onClick={() => { openModal('coffee', null); setMenuOpen(false) }}>COFFEE</motion.div>
              <motion.div
                whileHover={{ scale: 1.1, x: -3 }}
                className={styles.menuItem} onClick={() => { window.open("https://shop.clovernyc.com", "_blank")?.focus(); setMenuOpen(false) }}>SHOP</motion.div>
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
