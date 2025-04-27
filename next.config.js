# next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export', // This is important for Netlify static deployment
  distDir: 'out',
  images: {
    unoptimized: true, // Required for static export
  },
  // Ensure we can find the pages directory
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
};

module.exports = nextConfig;
