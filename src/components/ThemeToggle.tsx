import React, { useState, useCallback } from 'react';
import { useTheme } from '../providers/ThemeProvider';
import clsx from 'clsx';

const SunIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="currentColor"
    className="sun-icon"
  >
    <path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z" />
  </svg>
);

const MoonIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="currentColor"
    className="moon-icon"
  >
    <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1-8.313-12.454z" />
  </svg>
);

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-8 h-8 p-1.5',
  md: 'w-10 h-10 p-2',
  lg: 'w-12 h-12 p-3',
};

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const { isDark, toggleTheme, colors } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleClick = useCallback(() => {
    setIsAnimating(true);
    toggleTheme();
    const timer = setTimeout(() => setIsAnimating(false), 600);
    return () => clearTimeout(timer);
  }, [toggleTheme]);
  
  return (
    <button
      type="button"
      className={clsx(
        'relative rounded-full flex items-center justify-center',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'transition-all duration-200 ease-in-out',
        'hover:opacity-90 active:scale-95',
        'group',
        sizeClasses[size],
        className
      )}
      style={{
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
        border: 'none',
        color: isDark ? 'white' : 'black',
        ...(isAnimating && {
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }),
      }}
      onClick={handleClick}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <div className="relative w-5 h-5">
        {/* Sun Icon - Shows in dark mode */}
        <div 
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 transform ${
            isDark ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'
          }`}
        >
          <SunIcon />
        </div>
        {/* Moon Icon - Shows in light mode */}
        <div 
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 transform ${
            isDark ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'
          }`}
        >
          <MoonIcon />
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;
