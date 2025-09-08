// Environment variables with type safety
type EnvVar = {
  // API Configuration
  VITE_API_BASE_URL: string;
  
  // Google Generative AI
  VITE_GEMINI_API_KEY: string;
  
  // Application Settings
  NODE_ENV: 'development' | 'production' | 'test';
  IS_DEVELOPMENT: boolean;
  IS_PRODUCTION: boolean;
};

// Get environment variables with type safety
const getEnv = (): EnvVar => {
  const env = import.meta.env;
  
  // Check for required environment variables in development
  if (import.meta.env.DEV) {
    const requiredVars = ['VITE_API_BASE_URL', 'VITE_GEMINI_API_KEY'] as const;
    const missingVars = requiredVars.filter(varName => !env[varName] || env[varName].includes('your_'));
    
    if (missingVars.length > 0) {
      console.warn('\n⚠️  Missing or default environment variables detected:');
      missingVars.forEach(varName => {
        console.warn(`   - ${varName} is ${env[varName] ? 'using default value' : 'not set'}`);
      });
      console.warn('   Please update these in your .env.local file\n');
    }
  }

  return {
    // API Configuration
    VITE_API_BASE_URL: env.VITE_API_BASE_URL || 'http://localhost:8000/api',
    
    // Google Generative AI
    VITE_GEMINI_API_KEY: env.VITE_GEMINI_API_KEY || '',
    
    // Application Settings
    NODE_ENV: env.MODE as 'development' | 'production' | 'test',
    IS_DEVELOPMENT: env.DEV,
    IS_PRODUCTION: env.PROD,
  };
};

// Export the environment variables
export const env = getEnv();
