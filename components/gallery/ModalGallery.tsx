import React from "react";
import ReactDOM from "react-dom";
import HorizontalGallery from "./horizontalScrollGallery";

interface ModalProps {
    onClose : Function,
    public_id : string | null,
}

const Modal : React.FC<ModalProps> = ({ onClose, public_id }) => {
    const handleCloseClick = (e : React.MouseEvent<HTMLAnchorElement>) => {
        // reset public id on close
        console.log("handling close click")
        public_id = null;
        e.preventDefault();
        onClose();
    };

    const modalContent = (
        <div className="modal-overlay">
            {/* Wrap the whole Modal inside the newly created StyledModalWrapper
            and use the ref */}
            <div className="modal-wrapper" >
                <div className="modal" >
                    <a style={{position: "absolute", top: 10, right: 10, fontSize: 32, width: 32, height: 32, zIndex: 25}} href="#" onClick={handleCloseClick}>
                        x
                    </a>
                    <div className="modal-body" >
                        <HorizontalGallery public_id={public_id}  />
                    </div>
                </div>
            </div>
        </div>
    );

    return   document.getElementById("modal-root")
    ? ReactDOM.createPortal(
        modalContent,
        document.getElementById("modal-root") as Element // This cast is safe now
      )
    : null 
};

export default Modal