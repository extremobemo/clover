import { useRouter } from 'next/router'
import SmoothScroll from "../components/gallery/horizontalScrollGalery";

export default function Gallery({ Component, pageProps }) {
	
	const router = useRouter()
	const pageKey = router.asPath

	return (
			<SmoothScroll/>
	)
}