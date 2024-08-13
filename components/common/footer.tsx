import styles from '../../styles/Home.module.css';
import { Menu, MenuItem } from "../common/Menu";
import Link from 'next/link';
import { useState } from "react";
import type { MotionProps, Variants } from "framer-motion";
import Image from 'next/image';

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

  return (
    <div className={styles.footer}>
      <Menu
        label={
          <div style={{ position: 'relative', width: '100px', height: '100px' }}>
          <Image src={'/logofooter.png'} alt="Clover Footer" layout="fill"
                  objectFit="contain"
                  style={{ width: '100%', height: '100%' }} />
          </div>
        }
        open={open1}
        setOpen={setOpen}
        animate={open1 ? "open" : "closed"}
        initial="closed"
        exit="closed"
        variants={menu}
      >
        <MenuItem {...item} className={styles.menuitem} onClick={() => setOpen(false)}>
          <Link href="/"> INDEX </Link>
        </MenuItem>

        <MenuItem {...item} className={styles.menuitem}>SHOP</MenuItem>
        <MenuItem {...item} className={styles.menuitem}>COFFEE</MenuItem>
        <MenuItem {...item} className={styles.menuitem}>ABOUT</MenuItem>
        <MenuItem {...item} className={styles.menuitem}>CONTACT</MenuItem>
      </Menu>
    </div>
  );
};


