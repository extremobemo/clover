import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { AnimatePresence } from 'framer-motion';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Disable default scroll restoration
      window.history.scrollRestoration = 'manual';

      const handleRouteChange = () => {
        // Save the scroll position before the route change
        sessionStorage.setItem('scrollPosition', window.scrollY.toString());
        document.body.style.overflow = 'hidden'; // Disable scroll
      };

      const handleRouteChangeComplete = () => {
        // Restore scroll position after route change
        const scrollPosition = sessionStorage.getItem('scrollPosition');
        if (scrollPosition) {
          window.scrollTo(0, parseInt(scrollPosition, 10));
          sessionStorage.removeItem('scrollPosition');
        }
        document.body.style.overflow = ''; // Re-enable scroll
      };

      router.events.on('routeChangeStart', handleRouteChange);
      router.events.on('routeChangeComplete', handleRouteChangeComplete);
      router.events.on('routeChangeError', handleRouteChangeComplete);

      return () => {
        router.events.off('routeChangeStart', handleRouteChange);
        router.events.off('routeChangeComplete', handleRouteChangeComplete);
        router.events.off('routeChangeError', handleRouteChangeComplete);
      };
    }
  }, [router]);

  return (
    <AnimatePresence>
      <Component key={router.asPath} {...pageProps} />
      <div id="modal-root"></div> {/* Modal portal */}
    </AnimatePresence>
  );
}
