import ReactDOM from "react-dom";
import HorizontalGallery from "./horizontalScrollGallery";
import styles from "../../styles/Modal.module.css"
import ScrollIndicator from "../common/ScrollIndicator";

interface ModalProps {
    onClose : Function,
    public_id : string | null,
    state : string | null,
}

const Modal : React.FC<ModalProps> = ({ onClose, public_id, state }) => {
    const handleCloseClick = (e : React.MouseEvent<HTMLAnchorElement>) => {
        // reset public id on close
        console.log("handling close click")
        public_id = null; // I don't think we need this
        e.preventDefault();
        onClose();
    };

    const modalContent = (
        <div className={styles.modalOverlay}>
            {/* Wrap the whole Modal inside the newly created StyledModalWrapper
            and use the ref */}
            <div className={styles.modalWrapper} >
                <div className={styles.modal} >
                    <a style={{position: "absolute", top: 10, right: 10, fontSize: 32, width: 32, height: 32, zIndex: 25}} href="#" onClick={handleCloseClick}>
                        x
                    </a>
                    <div className={styles.modalBody} >
                        {
                            (state === 'gallery') && (
                                <HorizontalGallery public_id={public_id}  />
                        )}
                        {
                            (state === 'about') && (
                                <div>About
                                <ScrollIndicator/>
                                </div>
                            )
                        }
                           {
                            (state === 'coffee') && (
                                <div>Coffee
                                    <ScrollIndicator/>
                                </div>
                            )
                        }
                        
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