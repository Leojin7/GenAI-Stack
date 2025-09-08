import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables from .env files
  const env = loadEnv(mode, process.cwd(), '');
  
  // Check if required environment variables are set
  const requiredVars = ['VITE_API_BASE_URL', 'VITE_GEMINI_API_KEY'] as const;
  const missingVars = requiredVars.filter(varName => !env[varName] || env[varName].includes('your_'));
  
  if (missingVars.length > 0) {
    console.warn('\n⚠️  Missing or default environment variables detected:');
    missingVars.forEach(varName => {
      console.warn(`   - ${varName} is ${env[varName] ? 'using default value' : 'not set'}`);
    });
    console.warn('   Please update these in your .env.local file\n');
  }

  return {
    plugins: [react()],
    define: {
      'process.env': {
        VITE_API_BASE_URL: JSON.stringify(env.VITE_API_BASE_URL || 'http://localhost:8000/api'),
        VITE_GEMINI_API_KEY: JSON.stringify(env.VITE_GEMINI_API_KEY || '')
      }
    },
    resolve: {
      alias: [
        { find: '@', replacement: path.resolve(__dirname, 'src') },
        { find: '@utils', replacement: path.resolve(__dirname, 'src/utils') },
        { find: '@components', replacement: path.resolve(__dirname, 'src/components') },
        { find: '@services', replacement: path.resolve(__dirname, 'services') }
      ]
    },
    server: {
      port: 3000,
      open: true,
      host: true,
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
          ws: true,
        },
      },
    },
  };
});
