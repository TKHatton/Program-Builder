import '@/app/globals.css';

// This file is needed for Next.js pages directory structure
// It wraps all pages with common providers and layout
export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
