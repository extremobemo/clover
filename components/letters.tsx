import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const randomInRange = (min : number, max : number) => Math.random() * (max - min) + min;


const CloverEffect = () => {
  const [scrollY, setScrollY] = useState(0);
  const [letterWidth, setLetterWidth] = useState(0); // Dynamic letter width

  useEffect(() => {
    const curtain = document.getElementById('curtain');

    const handleScroll = () => {
      if (curtain) {
        setScrollY(curtain.scrollTop); 
      }
    };

    if (curtain) {
      curtain.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (curtain) {
        curtain.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const letters = ['c', 'l', 'o', 'v', 'e', 'r'];

  const totalWidth = (letters.length * letterWidth);
  const centerOffset = (totalWidth / 2) -  (letterWidth  / 2);

  const [windowHeight, setWindowHeight] = useState(0);

    // Dynamic letter width
    useEffect(() => {
      if (typeof window !== 'undefined') {
        const updateLetterWidth = () => {
          setLetterWidth(window.innerWidth * 0.15); // Calculate 15vw
        };
  
        updateLetterWidth();
        window.addEventListener('resize', updateLetterWidth);
  
        return () => {
          window.removeEventListener('resize', updateLetterWidth);
        };
      }
    }, []);

  useEffect(() => {
    // Update windowHeight when the component mounts
    setWindowHeight(window.innerHeight);

    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const offsets = [
    { x: -100, y: -100, rotation: 15 },  // C
    { x: -60, y: -0, rotation: 0 },      // L
    { x: 0, y: 60, rotation: 0 },        // O
    { x: 30, y: -80, rotation: 10 },     // V
    { x: 50, y: -20, rotation: 0 },      // E
    { x: 120, y: -90, rotation: 5 },     // R
  ];

  const getPositionStyle = (index : number) => {

    const movementFactor = scrollY * 0.04;
  
    const initialX = (index * letterWidth) - centerOffset;
    const initialY = 0; 
  
    // Define movement vectors for each letter
    const movementVectors = [
      { x: -0.2, y: -2 },  // First letter (C): moves up-left
      { x: -0.15, y: -2 },   // Second letter (L): moves down-left
      { x: 0, y: -2.5 }, // Third letter (O): moves up
      { x: -0.15, y: -2.2 }, // Fourth letter (V): moves down
      { x: 0.2, y: -2 },   // Fifth letter (E): moves up-right
      { x: 0.2, y: -2 },    // Sixth letter (R): moves down-right
    ];
  
    // Get the movement vector for the current letter
    const movementVector = movementVectors[index];
  
    // Calculate the final X and Y based on the movement vector
    const finalX = movementVector.x * movementFactor * 10
    const finalY = movementVector.y * movementFactor * 10;

    const maxScroll = windowHeight; 
    const opacity = Math.max(.75 - (scrollY / maxScroll) || .75, .75);
    const rotation = offsets[index].rotation; 

    return {
      transform: `translate(${initialX + finalX}px, ${initialY + finalY}px) rotate(${rotation}deg)`,
      opacity: opacity,
      transition: 'transform, opacity',
    };
  };
  
  
  return (
    <div style={{ height: 'auto' }}> 
      <div style={{
        position: 'fixed',
        top: '45%',
        left: '50%',
        transform: 'translate(-50%, 0%)',
        display: 'flex',
        justifyContent: 'space-evenly', // Natural spacing
        width: '80vw',
        pointerEvents: 'none',
      }}>
       {letters.map((letter, index) => (
  <div
    key={index}
    style={{
      position: 'absolute',
      ...getPositionStyle(index),
      willChange: 'transform',
    }}
  >
    {index === 2 ? (
      <motion.img
        src={`/${letter}.png`}
        alt={letter}
        style={{ width: '15vw', height: 'auto', willChange: 'transform', }}
      />
    ) : (
      <motion.img
        src={`/${letter}.png`}
        alt={letter}
        style={{ width: '15vw', height: 'auto', willChange: 'transform', }}
        animate={{
          x: [-40, 40, -40], // Moves side-to-side
          rotate: [-4, 2, -4], // Rotates back and forth
        }}
        transition={{
          x: {
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          },
          rotate: {
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      />
    )}
  </div>
))}

      </div>
    </div>
  );
};

export default CloverEffect;
