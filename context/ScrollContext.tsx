// context/ScrollContext.tsx
import React, { createContext, useState, useContext } from 'react';

interface ScrollContextProps {
  imageOffScreen: boolean;
  setImageOffScreen: (offScreen: boolean) => void;
}

const ScrollContext = createContext<ScrollContextProps | undefined>(undefined);

export const useScrollContext = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScrollContext must be used within a ScrollProvider');
  }
  return context;
};

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [imageOffScreen, setImageOffScreen] = useState(false);

  return (
    <ScrollContext.Provider value={{ imageOffScreen, setImageOffScreen }}>
      {children}
    </ScrollContext.Provider>
  );
};
