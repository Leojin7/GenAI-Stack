import React, { CSSProperties } from 'react';
import { Handle, HandleProps } from 'reactflow';
import clsx from 'clsx';

type CustomHandleProps = HandleProps & {
  label: string;
  style?: CSSProperties;
  className?: string;
};

export const CustomHandle: React.FC<CustomHandleProps> = ({ 
  label, 
  style,
  className = '',
  ...props 
}) => {
  const handleStyle: CSSProperties = {
    width: '10px',
    height: '10px',
    backgroundColor: 'var(--color-node-handle)',
    border: '2px solid var(--color-bg-surface)',
    ...style
  };

  return (
    <>
      <Handle 
        {...props} 
        style={handleStyle}
        className={clsx('react-flow__handle', className)}
      />
      <div 
        className={clsx(
          'handle-label', 
          'text-xs text-gray-500 mt-1',
          props.type === 'source' ? 'source-label' : 'target-label'
        )}
      >
        {label}
      </div>
    </>
  );
};
