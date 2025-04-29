import Link from 'next/link';

export default function Home() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Hello, Lenise!</h1>
      <p style={styles.subheading}>What program would you like to create today?</p>
      <Link href="/create-program">
        <button style={styles.button}>Start Building ✨</button>
      </Link>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#e0ae8f', // Peachy Tan background
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Poppins, sans-serif',
    padding: '2rem',
    textAlign: 'center',
  },
  heading: {
    fontSize: '3rem',
    color: '#745d6b', // Muted purple
    marginBottom: '1rem',
  },
  subheading: {
    fontSize: '1.5rem',
    color: '#7a907a', // Green-gray
    marginBottom: '2rem',
  },
  button: {
    backgroundColor: '#a85f72', // Warm mauve
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '0.75rem 2rem',
    fontSize: '1.25rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};
