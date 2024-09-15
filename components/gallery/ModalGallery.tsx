import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import HorizontalGallery from "./horizontalScrollGallery";
import { Position } from "@cloudinary/url-gen/qualifiers";
import { useScrollPosition } from "../../hooks/useScrollPosition";

const Modal = ({ onClose, public_id }) => {
    const handleCloseClick = (e) => {
        // reset public id on close
        public_id = null;
        e.preventDefault();
        onClose();
    };

    // const { maxScroll, position } = useScrollPosition("scroll-container2");

    // useEffect(() => {
    //     console.log("maxScroll", maxScroll);
    //     console.log("position", position);
    //     // Do something when maxScroll changes
    // }, [maxScroll, position]);

    const modalContent = (
        <div className="modal-overlay">
            {/* Wrap the whole Modal inside the newly created StyledModalWrapper
            and use the ref */}
            <div className="modal-wrapper" >
                <div className="modal" >
                    <a style={{position: "absolute", top: 10, right: 10, fontSize: 32, width: 32, height: 32}} href="#" onClick={handleCloseClick}>
                        x
                    </a>
                    <div className="modal-body" id="scroll-container2" >
                        <HorizontalGallery public_id={public_id}  />
                    </div>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(
        modalContent,
        document.getElementById("modal-root")
    );
};

export default Modal