/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Backend API configuration
  readonly VITE_API_BASE_URL: string;
  
  // Google Generative AI
  readonly VITE_GEMINI_API_KEY: string;
  
  // Application settings
  readonly MODE: 'development' | 'production' | 'test';
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
