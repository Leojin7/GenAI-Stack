import React from 'react';
import { useTheme } from '../src/providers/ThemeProvider';
import ThemeToggle from '../src/components/ThemeToggle.new';

export const TopBar: React.FC = () => {
  const { colors } = useTheme();

  return (
    <div style={{
      height: '56px',
      padding: '0 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: `1px solid ${colors.border}`,
      backgroundColor: colors.surface,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ 
          fontSize: '18px', 
          fontWeight: 600,
          color: colors.primary,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span className="icon-layout" style={{ fontSize: '20px' }} />
          Workflow Editor
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: colors.primary,
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.primaryDark;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.primary;
            }}
          >
            <span className="icon-play" style={{ fontSize: '14px' }} />
            Run Workflow
          </button>
          
          <button 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: 'transparent',
              color: colors.text,
              border: `1px solid ${colors.border}`,
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.hover?.surface || '#f5f5f5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span className="icon-save" style={{ fontSize: '14px' }} />
            Save
          </button>
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          padding: '4px 10px',
          backgroundColor: colors.surfaceVariant,
          borderRadius: '12px',
          fontSize: '12px',
          color: colors.textSecondary,
          border: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <span className="icon-globe" style={{ fontSize: '12px' }} />
          Online
        </div>
        
        <ThemeToggle />
        
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: colors.primaryLight,
          color: colors.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
          fontSize: '14px',
          cursor: 'pointer',
        }}>
          U
        </div>
      </div>
    </div>
  );
};
