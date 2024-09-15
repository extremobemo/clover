import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const randomInRange = (min, max) => Math.random() * (max - min) + min;
const letterWidth = 50

const CloverEffect = () => {
  const [scrollY, setScrollY] = useState(0);

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
  

  const getPositionStyle = (index) => {

    const movementFactor = scrollY * 0.04;
  
    const initialX = (index * letterWidth) - centerOffset;
    const initialY = 0; 
  
    // Define movement vectors for each letter
    const movementVectors = [
      { x: -0.2, y: -1 },  // First letter (C): moves up-left
      { x: -0.5, y: 1 },   // Second letter (L): moves down-left
      { x: 0.15, y: -1.2 }, // Third letter (O): moves up
      { x: -0.15, y: 1.2 }, // Fourth letter (V): moves down
      { x: 0.5, y: -1 },   // Fifth letter (E): moves up-right
      { x: 0.2, y: 1 },    // Sixth letter (R): moves down-right
    ];
  
    // Get the movement vector for the current letter
    const movementVector = movementVectors[index];
  
    // Apply the movement factor
    const randomXOffset = randomInRange(-50, 50) * movementFactor * 0.01;
    const randomYOffset = randomInRange(-50, 50) * movementFactor * 0.01;
  
    // Calculate the final X and Y based on the movement vector
    const finalX = movementVector.x * movementFactor * 10;
    const finalY = movementVector.y * movementFactor * 10;

    const maxScroll = windowHeight; 
    const opacity = Math.max(1 - (scrollY / maxScroll) || 0, 0);
  
    return {
      transform: `translate(${initialX + finalX}px, ${initialY + finalY}px)`,
      opacity: opacity,
      transition: 'transform, opacity',
    };
  };
  
  
  return (
    <div style={{ height: '400vh' }}> 
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
      }}>
        {letters.map((letter, index) => (
          <div
          key={index}
          className="letter"
          style={{
            position: 'absolute',
            transition: 'transform, opacity',
            ...getPositionStyle(index),
          }}
        >
            <img src={`/${letter}.png`} alt={letter} style={{ width: letterWidth, height: '50px' }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CloverEffect;
