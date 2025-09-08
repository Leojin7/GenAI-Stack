import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';

type ThemeMode = 'light' | 'dark';

interface ThemeColors {
  // Brand colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Background and surface
  background: string;
  surface: string;
  surfaceVariant: string;
  
  // Text and borders
  text: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  borderLight: string;
  
  // Component specific
  node: {
    background: string;
    border: string;
    headerBg: string;
    headerText: string;
    selectedBorder: string;
  };
  
  // Interactive states
  hover: {
    primary: string;
    surface: string;
  };
  
  // For type safety
  [key: string]: any;
}

interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  colors: ThemeColors;
  getColor: (path: string) => string | undefined;
}

const lightColors: ThemeColors = {
  // Brand colors
  primary: '#4361ee',
  primaryLight: '#eef2ff',
  primaryDark: '#3730a3',
  secondary: '#3f37c9',
  
  // Status colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  // Background and surface
  background: '#f8f9fa',
  surface: '#ffffff',
  surfaceVariant: '#f1f5f9',
  
  // Text and borders
  text: '#1e293b',
  textSecondary: '#64748b',
  textTertiary: '#94a3b8',
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  
  // Component specific
  node: {
    background: '#ffffff',
    border: '#e2e8f0',
    headerBg: '#f8fafc',
    headerText: '#1e293b',
    selectedBorder: '#3b82f6'
  },
  
  // Interactive states
  hover: {
    primary: '#4f46e5',
    surface: '#f1f5f9',
  }
};

const darkColors: ThemeColors = {
  // Brand colors
  primary: '#4f46e5',
  primaryLight: '#4338ca',
  primaryDark: '#3730a3',
  secondary: '#7c3aed',
  
  // Status colors
  success: '#34d399',
  warning: '#fbbf24',
  error: '#f87171',
  info: '#60a5fa',
  
  // Background and surface
  background: '#0f172a',
  surface: '#1e293b',
  surfaceVariant: '#334155',
  
  // Text and borders
  text: '#f8fafc',
  textSecondary: '#94a3b8',
  textTertiary: '#64748b',
  border: '#334155',
  borderLight: '#1e293b',
  
  // Component specific
  node: {
    background: '#1e293b',
    border: '#334155',
    headerBg: '#1e293b',
    headerText: '#f8fafc',
    selectedBorder: '#60a5fa'
  },
  
  // Interactive states
  hover: {
    primary: '#3b82f6',
    surface: '#334155',
  }
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  isDark: false,
  colors: lightColors,
  toggleTheme: () => {},
  getColor: () => undefined,
});

// Error boundary for theme provider
class ThemeErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Theme Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong with the theme. Please refresh the page.</div>;
    }
    return this.props.children;
  }
}

export const useTheme = (): ThemeContextType => {
  return useContext(ThemeContext);
};


// Performance optimization: Only update changed values
const updateCSSVariables = (themeColors: ThemeColors, prevThemeColors?: ThemeColors) => {
  const root = document.documentElement;
  
  const updateNestedVars = (prefix: string, obj: Record<string, any>, prevObj?: Record<string, any>) => {
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        updateNestedVars(prefix ? `${prefix}-${key}` : key, value, prevObj?.[key]);
        return;
      }
      
      const cssVar = `--color-${prefix ? `${prefix}-` : ''}${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      
      // Only update if the value has changed
      if (!prevObj || prevObj[key] !== value) {
        root.style.setProperty(cssVar, String(value));
      }
    });
  };
  
  // Update root level variables
  updateNestedVars('', themeColors, prevThemeColors);
  
  // Update nested objects
  Object.entries(themeColors).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      updateNestedVars(key, value, prevThemeColors?.[key]);
    }
  });
};


export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [isDark, setIsDark] = useState(false);
  const [colors, setColors] = useState<ThemeColors>(lightColors);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Memoize theme colors to prevent unnecessary re-renders
  const themeColors = useMemo(() => ({
    light: lightColors,
    dark: darkColors
  }), []);

  // Apply theme colors to CSS variables
  const applyTheme = useCallback((themeMode: ThemeMode) => {
    try {
      const newColors = themeColors[themeMode];
      
      // Update CSS variables
      updateCSSVariables(newColors, themeMode === 'light' ? darkColors : lightColors);
      
      // Update data-theme attribute
      document.documentElement.setAttribute('data-theme', themeMode);
      
      // Batch state updates
      ReactDOM.unstable_batchedUpdates(() => {
        setColors(newColors);
        setTheme(themeMode);
        setIsDark(themeMode === 'dark');
      });
      
      // Save to localStorage
      try {
        localStorage.setItem('theme', themeMode);
      } catch (e) {
        console.warn('Failed to save theme preference to localStorage:', e);
      }
      
      return true;
    } catch (error) {
      console.error('Error applying theme:', error);
      return false;
    }
  }, [themeColors]);

  // Initialize theme
  useEffect(() => {
    if (isInitialized) return;
    
    try {
      // Get saved theme or fallback to system preference
      let savedTheme: ThemeMode | null = null;
      try {
        savedTheme = localStorage.getItem('theme') as ThemeMode | null;
      } catch (e) {
        console.warn('Failed to read theme from localStorage:', e);
      }
      
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
      
      applyTheme(initialTheme);
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing theme:', error);
      // Fallback to light theme
      applyTheme('light');
      setIsInitialized(true);
    }
  }, [applyTheme, isInitialized]);
  
  // Listen for system theme changes
  useEffect(() => {
    if (!isInitialized) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      try {
        // Only apply system theme if user hasn't explicitly set a preference
        if (!localStorage.getItem('theme')) {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      } catch (error) {
        console.error('Error handling theme change:', error);
      }
    };
    
    // Add event listener with error handling
    try {
      mediaQuery.addEventListener('change', handleChange);
    } catch (e) {
      console.warn('Error adding theme change listener:', e);
    }
    
    return () => {
      try {
        mediaQuery.removeEventListener('change', handleChange);
      } catch (e) {
        console.warn('Error removing theme change listener:', e);
      }
    };
  }, [applyTheme, isInitialized]);

  const toggleTheme = useCallback(() => {
    try {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      return applyTheme(newTheme);
    } catch (error) {
      console.error('Error toggling theme:', error);
      return false;
    }
  }, [theme, applyTheme]);
  
  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    theme,
    isDark,
    toggleTheme,
    colors,
    // Add helper function to get colors by path
    getColor: (path: string): string | undefined => {
      try {
        return path.split('.').reduce((obj, key) => obj?.[key], colors as any) as string | undefined;
      } catch (e) {
        console.warn(`Invalid color path: ${path}`);
        return undefined;
      }
    }
  }), [theme, isDark, toggleTheme, colors]);

  // Only render children once theme is initialized
  if (!isInitialized) {
    return (
      <div style={{ display: 'none' }}>
        {children}
      </div>
    );
  }
  
  return (
    <ThemeErrorBoundary>
      <ThemeContext.Provider value={contextValue}>
        {children}
      </ThemeContext.Provider>
    </ThemeErrorBoundary>
  );
};

export default ThemeProvider;
