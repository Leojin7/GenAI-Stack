/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Backend API configuration
  readonly VITE_API_BASE_URL?: string;
  
  // Google Generative AI
  readonly VITE_GEMINI_API_KEY?: string;
  
  // Application settings
  readonly MODE: 'development' | 'production' | 'test';
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  
  // Vite's hot module replacement API
  readonly hot?: {
    readonly data: any;
    accept(): void;
    accept(cb: (mod: any) => void): void;
    accept(dep: string, cb: (mod: any) => void): void;
    accept(deps: string[], cb: (mods: any[]) => void): void;
    dispose(cb: (data: any) => void): void;
    decline(): void;
    invalidate(): void;
    on(event: string, cb: (...args: any[]) => void): void;
  };

  // Vite's glob import API
  readonly glob: (pattern: string) => Record<string, () => Promise<{ [key: string]: any }>>;
  readonly globEager: (pattern: string) => Record<string, { [key: string]: any }>;
}
