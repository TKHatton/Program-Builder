import { useEffect } from 'react';
import { useRouter } from 'next/router';

// This file exists to satisfy Netlify's requirement for a pages directory
// It simply redirects to the app router's home page
export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the app router's home page
    router.push('/');
  }, [router]);
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1>Program Builder</h1>
      <p>Redirecting to the main application...</p>
    </div>
  );
}
