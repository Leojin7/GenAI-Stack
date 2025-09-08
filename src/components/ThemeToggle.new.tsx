import React, { useState, useCallback } from 'react';
import { useTheme } from '../providers/ThemeProvider';
import clsx from 'clsx';

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
  const { isDark, toggleTheme } = useTheme();
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
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
        'transition-all duration-200 ease-in-out',
        'bg-surface hover:bg-opacity-80 active:scale-95',
        'border border-border',
        sizeClasses[size],
        className,
        {
          'animate-pulse': isAnimating,
        }
      )}
      onClick={handleClick}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <div className="relative w-full h-full">
        {/* Sun Icon */}
        <div 
          className={clsx(
            'absolute inset-0 flex items-center justify-center transition-opacity duration-300',
            isDark ? 'opacity-0' : 'opacity-100'
          )}
          aria-hidden="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-full h-full text-yellow-500"
          >
            <path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z" />
          </svg>
        </div>
        
        {/* Moon Icon */}
        <div 
          className={clsx(
            'absolute inset-0 flex items-center justify-center transition-opacity duration-300',
            isDark ? 'opacity-100' : 'opacity-0'
          )}
          aria-hidden="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-full h-full text-blue-300"
          >
            <path d="M9.37 2.836a1 1 0 0 1 1.37.37c.36.588 1.52 1.794 1.52 3.794 0 2.21-1.79 4-4 4-1.99 0-3.202-1.165-3.794-1.52a1 1 0 0 1-.37-1.37c.19-.31.53-.5.88-.5h.01c.28 0 .54.15.67.39.17.29.53.48 1.1.48.83 0 1.5-.67 1.5-1.5 0-.57-.19-.93-.48-1.1-.24-.13-.39-.39-.39-.67 0-.35.19-.69.5-.88zM12 12c-3.31 0-6-2.69-6-6 0-.28.03-.55.08-.81.05-.26.12-.51.2-.75.12-.35.08-.74-.12-1.06-.2-.32-.54-.53-.92-.53h-.14c-.24 0-.48.05-.69.14C2.21 4.79 0 8.13 0 12c0 6.63 5.37 12 12 12 3.87 0 7.21-2.21 8.81-5.42.09-.21.14-.45.14-.69 0-.38-.21-.72-.53-.92-.32-.2-.71-.24-1.06-.12-.24.08-.49.15-.75.2-.26.05-.53.08-.81.08-3.31 0-6-2.69-6-6z" />
          </svg>
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;
