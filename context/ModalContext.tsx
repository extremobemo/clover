// ModalContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';

// Define the shape of the context
interface ModalContextType {
    showModal: boolean;
    modalState: string;
    newPublicId: string | null;
    openModal: (state: string, id: string | null) => void;
    closeModal: () => void;
}

// Create the context with a default value of undefined
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Props for the provider
interface ModalProviderProps {
    children: ReactNode;
}

// ModalProvider component
export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
    const router = useRouter();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalState, setModalState] = useState<string>('');
    const [newPublicId, setPublicId] = useState<string | null>(null);

    // Function to open a modal with specific state and public_id
    const openModal = (state: string, id: string | null) => {
        document.documentElement.style.overflowY = 'hidden';
        setModalState(state);
        setPublicId(id);
        setShowModal(true);

        // TODO: change this to push arguments to url instead of page-like stuff
        if (state === 'about') {
            //router.push("/about", undefined, { shallow: true });
            router.push(`/?page=${state}`, undefined, {shallow: true});
        } else if (state === 'gallery' && id) {
            //router.push(`/gallery/${id}`, undefined, { shallow: true });
            router.push(`/?gallery=${id}`, undefined, {shallow: true});
        }

       
    };

    // Function to close the modal
    const closeModal = () => {
        console.log("closing modal")
        document.documentElement.style.overflowY = 'auto';
        setShowModal(false);
        setModalState('');
        setPublicId(null);
        router.push("/", undefined, { shallow: true });
    };

    return (
        <ModalContext.Provider value={{ showModal, modalState, newPublicId, openModal, closeModal }}>
            {children}
        </ModalContext.Provider>
    );
};

// Custom hook for easier access to modal context
export const useModal = (): ModalContextType => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModal must be used within a ModalProvider");
    }
    return context;
};
