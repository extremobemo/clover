import { AppProps } from 'next/app'
import '../styles/globals.css';
import { ContextProvider } from '../context/AppContext';

export default function App({ Component, pageProps }: AppProps) {
	

	return (
		<ContextProvider>
      		<Component {...pageProps} />
    	</ContextProvider>
	)
}