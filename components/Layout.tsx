// components/Layout.tsx
import React, { ReactNode } from 'react';
import Footer from './common/Footer';

// Define the type for props, including children
interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className='layout'>
      {children}
      <Footer />
    </div>
  );
}

export default Layout;
