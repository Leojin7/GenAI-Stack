import { Edge, Node } from 'reactflow';
import { CustomNode, CustomNodeData } from './nodeTypes';

export * from './nodeTypes';

export interface Stack {
  id: string;
  name: string;
  description: string;
  nodes: CustomNode[];
  edges: Edge<CustomNodeData>[];
}
