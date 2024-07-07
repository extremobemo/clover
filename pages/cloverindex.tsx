import Image from 'next/image';
import { CSSProperties, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

type IndexPageProps = {};
type IndexPageRef = React.ForwardedRef<HTMLDivElement>;

export default function CloverIndex(props: IndexPageProps, ref: IndexPageRef) {
  const router = useRouter();

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  };

  return (

    <motion.div
      key="photoindex"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 0,
        ease: [0, 0.71, 0.2, 1.01],
      }}
      exit={{
        opacity: 0,
        scale: 0.75,
        transition: {
          ease: "easeIn",
          duration: .4,
        },
      }}
    >

      <div style={containerStyle}>
        <Image src="/old.jpeg" layout="fixed" width={200} height={200} objectFit="cover" alt="tet" key={1}/>
        <Image src="/old.jpeg" layout="fixed" width={200} height={200} objectFit="cover" alt="tet" key={2}/>
        <Image src="/old.jpeg" layout="fixed" width={200} height={200} objectFit="cover" alt="tet" key={3}/>
      </div>

    </motion.div>
  );
}
