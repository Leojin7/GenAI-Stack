import React, { useCallback } from 'react';
import { useTheme } from '../src/providers/ThemeProvider';
import { ComponentIcon } from './icons';

type NodeType = 'userQuery' | 'llm' | 'knowledgeBase' | 'output';

interface NodeTypeItem {
  type: NodeType;
  label: string;
  description: string;
  icon: string;
}

const NODE_TYPES: NodeTypeItem[] = [
  {
    type: 'userQuery',
    label: 'User Query',
    description: 'Starts the workflow with user input',
    icon: 'message-square'
  },
  {
    type: 'llm',
    label: 'LLM',
    description: 'Processes text using language models',
    icon: 'cpu'
  },
  {
    type: 'knowledgeBase',
    label: 'Knowledge Base',
    description: 'Stores and retrieves document knowledge',
    icon: 'database'
  },
  {
    type: 'output',
    label: 'Output',
    description: 'Displays the final result',
    icon: 'terminal'
  },
];

export const Sidebar: React.FC = () => {
  const { colors } = useTheme();

  const onDragStart = useCallback((event: React.DragEvent<HTMLDivElement>, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  return (
    <div
      className="node-palette"
      style={{
        width: '250px',
        padding: '16px',
        background: colors.backgroundSecondary,
        borderRight: `1px solid ${colors.border}`,
        height: '100%',
        overflowY: 'auto',
      }}
    >
      <div className="node-category">
        <h3 style={{
          fontSize: '14px',
          fontWeight: 600,
          marginBottom: '16px',
          color: colors.textSecondary,
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Core Components
        </h3>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {NODE_TYPES.map((node) => (
            <div
              key={node.type}
              draggable
              onDragStart={(event) => onDragStart(event, node.type)}
              className="node-item"
              style={{
                background: colors.surface,
                borderRadius: '8px',
                padding: '12px',
                border: `1px solid ${colors.border}`,
                cursor: 'grab',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                background: colors.primary + '1a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.primary,
              }}>
                <ComponentIcon type={node.type} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: colors.textPrimary,
                  marginBottom: '2px',
                }}>
                  {node.label}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: colors.textTertiary,
                  lineHeight: 1.4,
                }}>
                  {node.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
