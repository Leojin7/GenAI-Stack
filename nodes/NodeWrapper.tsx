import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { SettingsIcon, TrashIcon, ComponentIcon } from '../components/icons';
import { useTheme } from '../src/providers/ThemeProvider';
import { NodeType, CustomNodeData } from '../src/types/nodeTypes';

// Extract the valid props we want to pass to the div
const validDivProps = (props: Record<string, any>) => {
  const { 
    isConnectable,
    xPos,
    yPos,
    zIndex,
    sourcePosition,
    targetPosition,
    dragHandle,
    selected: _,
    ...rest 
  } = props;
  return rest;
};

interface NodeWrapperProps extends Omit<NodeProps<CustomNodeData>, 'data' | 'type' | 'selected' | 'dragging'> {
  title: string;
  type: NodeType;
  selected?: boolean;
  children: React.ReactNode;
  onDelete?: (id: string) => void;
  onSettingsClick?: (id: string) => void;
  icon?: NodeType;
  data: CustomNodeData;
  dragging?: boolean; // Add dragging prop to the interface
}

export const NodeWrapper: React.FC<NodeWrapperProps> = ({
  id,
  title,
  type,
  selected = false,
  children,
  onDelete,
  onSettingsClick,
  icon,
  data,
  dragging = false,
  ...nodeProps
}) => {
  const { colors, isDark } = useTheme();

  const nodeTypeStyles = {
    input: { borderLeftColor: colors.primary },
    output: { borderLeftColor: colors.success },
    process: { borderLeftColor: colors.secondary },
    utility: { borderLeftColor: colors.warning },
    knowledgeBase: { borderLeftColor: colors.error },
    llm: { borderLeftColor: colors.primary },
    userQuery: { borderLeftColor: colors.success },
  };

  const nodeStyle: React.CSSProperties = {
    backgroundColor: colors.surface,
    border: `1px solid ${selected ? colors.primary : colors.border}`,
    borderRadius: '8px',
    boxShadow: selected 
      ? `0 0 0 2px ${colors.primary}40` 
      : '0 2px 8px rgba(0, 0, 0, 0.1)',
    minWidth: '250px',
    fontFamily: 'inherit',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
    ...nodeTypeStyles[type],
    // Position the node using the xPos and yPos from react-flow
    position: 'absolute',
    left: nodeProps.xPos,
    top: nodeProps.yPos,
    transform: 'translate(-50%, -50%)',
  };

  const headerStyle: React.CSSProperties = {
    backgroundColor: isDark ? colors.surfaceVariant : colors.background,
    padding: '8px 12px',
    borderBottom: `1px solid ${colors.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const titleStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: 600,
    color: colors.text,
    margin: 0,
  };

  const contentStyle: React.CSSProperties = {
    padding: '12px',
  };

  const actionsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '4px',
  };

  const actionButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: colors.textSecondary,
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  };

  // Filter out invalid props before spreading
  const filteredProps = validDivProps(nodeProps);
  
  return (
    <div
      style={{
        ...nodeStyle,
        ...(type && nodeTypeStyles[type]),
        zIndex: selected ? 10 : 1, // Ensure selected nodes are on top
      }}
      className="relative transition-all duration-200"
      data-testid={`node-${type}`}
      data-dragging={dragging ? 'true' : undefined}
      data-selected={selected ? 'true' : undefined}
      {...filteredProps}
    >
      <div style={headerStyle}>
        <div style={titleStyle}>
          {icon && <ComponentIcon type={icon} />}
          {title}
        </div>
        <div style={actionsStyle}>
          {onSettingsClick && (
            <button 
              onClick={() => onSettingsClick(id)}
              style={actionButtonStyle}
              aria-label="Settings"
            >
              <SettingsIcon width={14} height={14} />
            </button>
          )}
          {onDelete && (
            <button 
              onClick={() => onDelete(id)}
              style={actionButtonStyle}
              aria-label="Delete"
            >
              <TrashIcon width={14} height={14} />
            </button>
          )}
        </div>
      </div>
      
      <div style={contentStyle}>
        {children}
      </div>
      
      <Handle 
        type="source" 
        position={Position.Bottom}
        style={{ background: colors.primary }}
      />
      <Handle 
        type="target" 
        position={Position.Top}
        style={{ background: colors.secondary }}
      />
    </div>
  );
};

export default NodeWrapper;
