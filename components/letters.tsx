import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const randomInRange = (min : number, max : number) => Math.random() * (max - min) + min;
const letterWidth = 200

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
  
  const offsets = [
    { x: -100, y: -100, rotation: 15 },  // C
    { x: -60, y: -0, rotation: 0 },  // L
    { x: 0, y: 60, rotation: 0 },        // O
    { x: 30, y: -80, rotation: 10 },     // V
    { x: 50, y: -20, rotation: 0 },     // E
    { x: 120, y: -90, rotation: 5 },      // R
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
  
    // Apply the movement factor
    const randomXOffset = randomInRange(-50, 50) * movementFactor * 0.01;
    const randomYOffset = randomInRange(-50, 50) * movementFactor * 0.01;
  
    // Calculate the final X and Y based on the movement vector
    const finalX = movementVector.x * movementFactor * 10 + offsets[index].x;
    const finalY = movementVector.y * movementFactor * 10 + offsets[index].y;

    const maxScroll = windowHeight; 
    const opacity = Math.max(1 - (scrollY / maxScroll) || 0, 0);
    const rotation = offsets[index].rotation; 

    return {
      transform: `translate(${initialX + finalX}px, ${initialY + finalY}px) rotate(${rotation}deg)`,
      opacity: opacity,
      transition: 'transform, opacity',
    };
  };
  
  
  return (
    <div style={{ height: '400vh' }}> 
      <div style={{
        position: 'fixed',
        top: '40%',
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
            ...getPositionStyle(index),
          }}
        >
            <img src={`/${letter}.png`} alt={letter} style={{ width: 400, height: 450 }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CloverEffect;
