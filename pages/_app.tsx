import { AnimatePresence } from 'framer-motion'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import Layout from '../components/layout'

export default function App({ Component, pageProps }: AppProps) {
	const router = useRouter()
	const pageKey = router.asPath

	return (
        <Layout>
		<AnimatePresence initial={false} mode="wait">
			<Component key={pageKey} {...pageProps} />
		</AnimatePresence>
        </Layout>
	)
}