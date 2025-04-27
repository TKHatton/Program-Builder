// This file is needed to support the _app.js file
// It provides basic styling for the pages directory components

import '@/app/globals.css';

export default function Document({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
