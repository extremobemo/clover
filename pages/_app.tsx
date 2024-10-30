import { AppProps } from 'next/app'
import '../styles/globals.css';
import { ModalProvider } from '../context/ModalContext';

export default function App({ Component, pageProps }: AppProps) {
	

	return (
		<ModalProvider>
      		<Component {...pageProps} />
    	</ModalProvider>
	)
}