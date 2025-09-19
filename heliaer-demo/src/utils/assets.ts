// Utility function to get the correct asset path for public assets
export const getAssetPath = (path: string): string => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // Use Vite's BASE_URL environment variable to get the correct base path
  return `${import.meta.env.BASE_URL}${cleanPath}`;
};