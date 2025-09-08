import React, { useState, useCallback, useMemo, useEffect, useRef, DragEvent } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Background,
  Controls,
  ReactFlowProvider,
  NodeChange,
  EdgeChange,
  Connection,
  applyNodeChanges,
  applyEdgeChanges,
  ReactFlowInstance,
} from 'reactflow';
import { GoogleGenAI } from '@google/genai';
import { ComponentIcon } from '../components/icons';

type ComponentType = 'userQuery' | 'llm' | 'knowledgeBase' | 'output';
import { UserQueryNode } from '../nodes/UserQueryNode';
import { KnowledgeBaseNode } from '../nodes/KnowledgeBaseNode';
import { LLMNode } from '../nodes/LLMNode';
import { OutputNode } from '../nodes/OutputNode';
import clsx from 'clsx';

import { env } from '../src/utils/env';

// Initialize GoogleGenAI with the API key from environment variables
let ai: GoogleGenAI | null = null;

// Define node types outside the component
const NODE_TYPES = {
  userQuery: UserQueryNode,
  knowledgeBase: KnowledgeBaseNode,
  llm: LLMNode,
  output: OutputNode,
} as const;

try {
  const apiKey = env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('Google Generative AI API key is not set. Please set VITE_GEMINI_API_KEY in your .env.local file');
  } else {
    ai = new GoogleGenAI({ apiKey });
  }
} catch (error) {
  console.error('Failed to initialize Google Generative AI:', error);
}

type NodeData = {
  userQuery: { query: string };
  llm: { prompt: string; webSearchEnabled: boolean };
  knowledgeBase: { fileName: string | null };
  output: { result: any; isLoading: boolean };
};

const nodeDefaults: NodeData = {
  userQuery: { query: '' },
  llm: { prompt: "User Query: {query}", webSearchEnabled: false },
  knowledgeBase: { fileName: null },
  output: { result: null, isLoading: false },
};

interface WorkflowEditorViewProps {
  initialNodes: Node[];
  initialEdges: Edge[];
  onSave: (nodes: Node[], edges: Edge[]) => void;
  saveTrigger: number;
  runTrigger: number;
}

interface SidebarComponent {
  type: keyof NodeData;
  label: string;
}

const sidebarComponents: SidebarComponent[] = [
  { type: 'userQuery', label: 'User Query' },
  { type: 'llm', label: 'LLM (OpenAI)' },
  { type: 'knowledgeBase', label: 'Knowledge Base' },
  { type: 'output', label: 'Output' },
];

let id = 5;
const getId = () => `dndnode_${id++}`;

const Editor: React.FC<WorkflowEditorViewProps> = ({ initialNodes, initialEdges, onSave, saveTrigger, runTrigger }) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [draggingComponent, setDraggingComponent] = useState<string | null>(null);

  const history = useRef<({ nodes: Node[], edges: Edge[] })[]>([]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Handle Save Trigger from Parent
  useEffect(() => {
    if (saveTrigger > 0) {
      onSave(nodes, edges);
    }
  }, [saveTrigger, onSave, nodes, edges]);

  // Handle Run Trigger from Parent
  useEffect(() => {
    if (runTrigger > 0) {
      handleRun();
    }
  }, [runTrigger]);

  const saveToHistory = useCallback((currentNodes: Node[], currentEdges: Edge[]) => {
    const newHistory = history.current.slice(0, historyIndex + 1);
    newHistory.push({ nodes: currentNodes, edges: currentEdges });
    history.current = newHistory;
    setHistoryIndex(newHistory.length - 1);
  }, [historyIndex]);

  const onNodesChange = useCallback((changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)), [setNodes]);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => {
      const nextEdges = applyEdgeChanges(changes, eds);
      if (changes.some(c => c.type === 'remove' || c.type === 'add')) {
        saveToHistory(nodes, nextEdges);
      }
      return nextEdges;
    });
  }, [setEdges, saveToHistory, nodes]);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => {
      const newEdges = addEdge(params, eds);
      saveToHistory(nodes, newEdges);
      return newEdges;
    });
  }, [setEdges, saveToHistory, nodes]);

  const updateNodeData = useCallback((nodeId: string, field: string, value: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, [field]: value } } : node
      )
    );
  }, [setNodes]);

  const handleDeleteNode = useCallback((nodeId: string) => {
    const nextNodes = nodes.filter(n => n.id !== nodeId);
    const nextEdges = edges.filter(e => e.source !== nodeId && e.target !== nodeId);
    setNodes(nextNodes);
    setEdges(nextEdges);
    saveToHistory(nextNodes, nextEdges);
  }, [nodes, edges, setNodes, setEdges, saveToHistory]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const prevState = history.current[newIndex];
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setHistoryIndex(newIndex);
    }
  }, [historyIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        event.preventDefault();
        undo();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo]);

  useEffect(() => {
    history.current = [{ nodes, edges }];
    setHistoryIndex(0);
  }, []);

  const handleRun = async () => {
    const outputNode = nodes.find(n => n.type === 'output');
    if (!outputNode) return;

    updateNodeData(outputNode.id, 'isLoading', true);
    updateNodeData(outputNode.id, 'result', '');

    try {
      // Check if AI is initialized
      if (!ai) {
        throw new Error('Google Generative AI is not properly initialized. Please check your API key in .env.local');
      }

      const userQueryNode = nodes.find(n => n.type === 'userQuery');
      const query = userQueryNode?.data?.query || 'Tell me a story.';

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: query,
      });

      updateNodeData(outputNode.id, 'result', response.text);
    } catch (error) {
      console.error("Error running workflow:", error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      updateNodeData(outputNode.id, 'result', `Error: ${errorMessage}`);
    } finally {
      updateNodeData(outputNode.id, 'isLoading', false);
    }
  };

  const onDragStart = (event: DragEvent, nodeType: keyof NodeData) => {
    // nodeType is already compatible with ComponentType
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
    setDraggingComponent(nodeType);
  };

  const onDragEnd = () => setDraggingComponent(null);

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: DragEvent) => {
    event.preventDefault();
    setDraggingComponent(null);
    if (!reactFlowInstance || !reactFlowWrapper.current) return;

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const type = event.dataTransfer.getData('application/reactflow') as keyof NodeData;
    if (!type || !(type in nodeDefaults)) return;

    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });

    const newNode: Node = {
      id: getId(),
      type,
      data: { ...nodeDefaults[type] },
      position,
    };

    setNodes((nds) => {
      const newNodes = nds.concat(newNode);
      saveToHistory(newNodes, edges);
      return newNodes;
    });
  }, [reactFlowInstance, edges, saveToHistory]
  );

  const nodesWithDataHandlers = useMemo(() => {
    return nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        onChange: updateNodeData,
        onDelete: handleDeleteNode,
      }
    }));
  }, [nodes, updateNodeData, handleDeleteNode]);

  return (
    <div className="editor-container">
      <aside className="sidebar">
        <h3>Components</h3>
        {sidebarComponents.map(comp => (
          <div
            key={comp.type}
            className={clsx("component-item", draggingComponent === comp.type && "dragging")}
            onDragStart={(event) => onDragStart(event, comp.type)}
            onDragEnd={onDragEnd}
            draggable
          >
            <ComponentIcon type={comp.type as any} /> <span>{comp.label}</span>
          </div>
        ))}
      </aside>
      <main className="editor-workspace" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodesWithDataHandlers}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={NODE_TYPES}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
          deleteKeyCode={['Backspace', 'Delete']}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </main>
    </div>
  );
};

export const WorkflowEditorView: React.FC<Omit<WorkflowEditorViewProps, 'onOpenChat'>> = (props) => (
  <ReactFlowProvider>
    <Editor {...props} />
  </ReactFlowProvider>
);
