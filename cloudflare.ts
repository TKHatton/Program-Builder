// Cloudflare context utility for the Program Builder application

// This function gets the Cloudflare context from the request
export function getCloudflareContext() {
  // In a real application, this would extract the context from the request
  // For now, we'll return a mock context for development
  return {
    env: {
      // Uncomment this when database is enabled in wrangler.toml
      // DB: null
    }
  };
}
