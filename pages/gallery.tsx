import React from 'react';
import ReactDOM from 'react-dom';
import { useRouter } from 'next/router';
import HorizontalGallery from '../components/gallery/horizontalScrollGallery'; // Import the actual gallery component

const Modal = ({ public_id }) => {
  const router = useRouter();

  const handleCloseClick = (e) => {
    e.preventDefault();
    router.back(); // Navigate back to the previous page
  };

  // Render modal only on the client side
  if (typeof window === 'undefined') {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-wrapper">
        <a
          href="#"
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            fontSize: 32,
            width: 32,
            height: 32,
          }}
          onClick={handleCloseClick}
        >
          x
        </a>
        <div className="modal-body">
          <HorizontalGallery />
        </div>
      </div>
    </div>,
    document.getElementById('modal-root') // Ensure this element exists in your HTML
  );
};

export default Modal;
