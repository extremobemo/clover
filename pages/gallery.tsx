import { useRouter } from 'next/router'
import HorizontalGallery from "../components/gallery/horizontalScrollGallery";

export default function Gallery({ Component, pageProps }) {
	
	const router = useRouter()
	const pageKey = router.asPath

	return (
		<HorizontalGallery/>
	)
}