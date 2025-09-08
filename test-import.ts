// Test file to verify imports
import { env } from './src/utils/env';

console.log('Environment variables:');
console.log('VITE_API_BASE_URL:', env.VITE_API_BASE_URL);
console.log('VITE_GEMINI_API_KEY:', env.VITE_GEMINI_API_KEY ? '*** (set)' : 'Not set');
