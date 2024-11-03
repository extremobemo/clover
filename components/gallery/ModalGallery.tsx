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

    const modalContent = (
        <div className={styles.modalOverlay}>
            {/* Wrap the whole Modal inside the newly created StyledModalWrapper
            and use the ref */}
            <div className={styles.modalWrapper} >
                <div className={styles.modal} >
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