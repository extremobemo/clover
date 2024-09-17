// import React, { useEffect } from "react";
// import ReactDOM from "react-dom";
// import { useRouter } from "next/router";
// import HorizontalGallery from "./horizontalScrollGallery";

// const Modal = ({ public_id }) => {
//   const router = useRouter();

//   const handleCloseClick = (e) => {
//     e.preventDefault();
//     router.back();  // Navigate back in history to close the modal
//   };

//   useEffect(() => {
//     const handleEsc = (event) => {
//       if (event.key === "Escape") {
//         router.back();  // Close the modal when "Escape" is pressed
//       }
//     };
//     window.addEventListener("keydown", handleEsc);
//     return () => {
//       window.removeEventListener("keydown", handleEsc);
//     };
//   }, [router]);

//   const modalContent = (
//     <div className="modal-overlay">
//       <div className="modal-wrapper">
//         <div className="modal">
//           <a
//             style={{
//               position: "absolute",
//               top: 10,
//               right: 10,
//               fontSize: 32,
//               width: 32,
//               height: 32,
//             }}
//             href="#"
//             onClick={handleCloseClick}
//           >
//             x
//           </a>
//           <div className="modal-body">
//             {/* <HorizontalGallery public_id={public_id} /> */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return ReactDOM.createPortal(
//     modalContent,
//     document.getElementById("modal-root")
//   );
// };

// export default Modal;
