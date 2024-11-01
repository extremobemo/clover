import styles from '../../styles/Footer.module.css';
import { Menu, MenuItem } from "./Menu";
import { useState } from "react";
import type { MotionProps, Variants } from "framer-motion";
import { useModal } from '../../context/ModalContext';

const menu = {
  closed: {
    scale: 0,
    transition: {
      delay: 0.15,
    },
  },
  open: {
    scale: 1,
    transition: {
      type: "spring",
      duration: 0.4,
      delayChildren: 0.2,
      staggerChildren: 0.05,
    },
  },
} satisfies Variants;

const item = {
  variants: {
    closed: { x: 0, opacity: 0 },
    open: { x: 0, opacity: 1 },
  },
  transition: { opacity: { duration: 0.2 } },
} satisfies MotionProps;


export default function Footer() {

  const [open1, setOpen] = useState(false);
  const { openModal } = useModal();

  return (
    <div className={styles.footer}>
      <Menu
        label={
          <div style={{ position: 'relative', width: '100px', height: '100px', opacity: 0, cursor: 'pointer' }}> 
          CLOVER
          </div>
        }
        open={open1}
        setOpen={setOpen}
        animate={open1 ? "open" : "closed"}
        initial="closed"
        exit="closed"
        variants={menu}
      >

        <MenuItem {...item} className={styles.menuitem}>SHOP</MenuItem>
        <MenuItem {...item} className={styles.menuitem} onClick={() => {setOpen(false); openModal('coffee', null);}}>COFFEE</MenuItem>
        <MenuItem {...item} className={styles.menuitem} onClick={() => {setOpen(false); openModal('about', null);}}>INFO/CONTACT</MenuItem>
      </Menu>
    </div>
  );
};


