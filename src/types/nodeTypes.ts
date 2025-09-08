import { Node, Edge } from 'reactflow';

export type NodeType = 'userQuery' | 'llm' | 'knowledgeBase' | 'output';

export type ComponentType = NodeType;

// Base interface with common properties
export interface BaseNodeData {
  label?: string;
  onChange?: (nodeId: string, field: string, value: any) => void;
  onDelete?: (nodeId: string) => void;
  isLoading?: boolean;
  [key: string]: any;
}

// Specific node data types
export interface UserQueryNodeData extends BaseNodeData {
  query: string;
}

export interface LLMNodeData extends BaseNodeData {
  prompt: string;
  webSearchEnabled: boolean;
  selected?: boolean;
  xPos?: number;
  yPos?: number;
  zIndex?: number;
  dragging?: boolean;
  onDelete?: (nodeId: string) => void;
}

export interface KnowledgeBaseNodeData extends BaseNodeData {
  fileName: string | null;
  selected?: boolean;
  xPos?: number;
  yPos?: number;
  zIndex?: number;
  dragging?: boolean;
  onDelete?: (nodeId: string) => void;
  onChange?: (nodeId: string, field: string, value: any) => void;
}

export interface OutputNodeData extends BaseNodeData {
  result: string;
  isLoading: boolean;
  selected?: boolean;
  xPos?: number;
  yPos?: number;
  zIndex?: number;
  dragging?: boolean;
  onDelete?: (nodeId: string) => void;
}

// Union type for all possible node data types
export type CustomNodeData = 
  | UserQueryNodeData 
  | LLMNodeData 
  | KnowledgeBaseNodeData 
  | OutputNodeData;

export interface CustomNode extends Node<CustomNodeData> {
  type: NodeType;
}

export interface NodeWrapperProps {
  id: string;
  title: string;
  type: NodeType;
  selected?: boolean;
  children: React.ReactNode;
  onDelete?: (id: string) => void;
  onSettingsClick?: (id: string) => void;
  icon?: NodeType;
  data: CustomNodeData;
}

export const NODE_TYPES = {
  userQuery: 'userQuery',
  llm: 'llm',
  knowledgeBase: 'knowledgeBase',
  output: 'output',
} as const;
