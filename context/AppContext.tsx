// AppContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';

// Define the shape of the context
interface AppContextType {
    showModal: boolean;
    modalState: string;
    handleIndexMenuClick: (state : string) => void;
    heroFilterState: string;
    publicId: string | null;
    openModal: (state: string, id: string | null) => void;
    closeModal: () => void;
}

// Create the context with a default value of undefined
const AppContext = createContext<AppContextType | undefined>(undefined);

// Props for the provider
interface ProviderProps {
    children: ReactNode;
}

// ModalProvider component
export const ContextProvider: React.FC<ProviderProps> = ({ children }) => {
    const router = useRouter();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalState, setModalState] = useState<string>('');
    const [heroFilterState, setHeroFilterState] = useState<string>('ALL');
    const [publicId, setPublicId] = useState<string | null>(null);

    // Function to open a modal with specific state and public_id
    const openModal = (state: string, id: string | null) => {
        document.documentElement.style.overflowY = 'hidden';
        setModalState(state);
        setPublicId(id);
        setShowModal(true);

        // TODO: change this to push arguments to url instead of page-like stuff
        if (state === 'about' || state === 'coffee') {
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

    const handleIndexMenuClick = ( state : string) => {
        setHeroFilterState(state);
        closeModal();
    }

    useEffect(() => {
        const handlePopState = () => {
            if (showModal) {
                closeModal();
            }
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [showModal]);

    return (
        <AppContext.Provider value={{ showModal, modalState, handleIndexMenuClick, heroFilterState, publicId, openModal, closeModal }}>
            {children}
        </AppContext.Provider>
    );
};

// Custom hook for easier access to modal context
export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within a AppContextProvider");
    }
    return context;
};
