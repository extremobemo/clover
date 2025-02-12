import ReactDOM from "react-dom";
import HorizontalGallery from "./horizontalScrollGallery";
import styles from "../../styles/Modal.module.css"
import ScrollIndicator from "../common/ScrollIndicator";
import CoffeeGallery from "./CoffeeGallery";
import NewInfoContact from "./NewInfoContact"
import { useAppContext } from "../../context/AppContext";

interface ModalProps {
    onClose: Function,
    public_id: string | null,
    state: string | null,
}

const Modal: React.FC<ModalProps> = ({ onClose, public_id, state }) => {
    const { closeModal } = useAppContext();
    const modalContent = (
        <div className={styles.modalOverlay}>
            {/* Wrap the whole Modal inside the newly created StyledModalWrapper
            and use the ref */}
            <div className={styles.modalWrapper} >
                <button onClick={() => { closeModal() }} className={styles.closeButton}>
                    <svg
                        className={styles.closeIcon}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="32"
                        height="32"
                        fill="none"
                        stroke="gray"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
                <div className={styles.modal} >
                    <div className={styles.modalBody} >
                        {
                            (state === 'gallery') && (
                                <HorizontalGallery public_id={public_id} />
                            )}
                        {
                            (state === 'about') && (
                                <>
                                    <NewInfoContact />
                                    <ScrollIndicator />
                                </>
                            )
                        }
                        {
                            (state === 'coffee') && (
                                <>
                                    <CoffeeGallery public_id={'CloverCoffee'} />
                                </>
                            )
                        }

                    </div>
                </div>
            </div>
        </div>
    );

    return document.getElementById("modal-root")
        ? ReactDOM.createPortal(
            modalContent,
            document.getElementById("modal-root") as Element // This cast is safe now
        )
        : null
};

export default Modal