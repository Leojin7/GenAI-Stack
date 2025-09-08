import React, { useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
  Node,
  Edge,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { CustomNode, NodeType } from '../src/types';
import { NodeWrapper } from '../nodes/NodeWrapper';
import { useTheme } from '../src/providers/ThemeProvider';

const nodeTypes = {
  userQuery: NodeWrapper,
  llm: NodeWrapper,
  knowledgeBase: NodeWrapper,
  output: NodeWrapper,
  text: NodeWrapper,
  code: NodeWrapper,
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export const Canvas: React.FC = () => {
  const { colors } = useTheme();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { project } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!reactFlowWrapper.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow') as NodeType;

      // Check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node = {
        id: `node-${Date.now()}`,
        type,
        position,
        data: { label: type },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [project, setNodes]
  );

  return (
    <div
      ref={reactFlowWrapper}
      style={{ width: '100%', height: '100%' }}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes as any}
        fitView
        nodesDraggable
        nodesConnectable
        elementsSelectable
        snapToGrid={true}
        snapGrid={[15, 15]}
        defaultEdgeOptions={{ type: 'smoothstep' }}
      >
        <Background color={colors.border} gap={16} />
        <Controls style={{ right: 20, bottom: 20 }} />
        <MiniMap
          nodeColor={(n) => {
            if (n.type === 'output') return colors.error;
            return colors.primary;
          }}
          style={{ right: 20, bottom: 60 }}
          nodeStrokeWidth={3}
          pannable
          zoomable
        />
      </ReactFlow>
    </div>
  );
};
