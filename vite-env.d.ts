/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Backend API configuration
  readonly VITE_API_BASE_URL: string;
  
  // AI API Keys
  readonly VITE_OPENAI_API_KEY: string;

  // Add other environment variables here as needed
  [key: string]: string | undefined;
}

// Extend the existing ImportMeta interface from Vite
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export {};
