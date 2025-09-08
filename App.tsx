import React, { useState, useCallback, useEffect } from 'react';
import { StacksListView } from './views/StacksListView';
import { WorkflowEditorView } from './views/WorkflowEditorView';
import { NewStackModal } from './components/NewStackModal';
import { ChatModal } from './components/ChatModal';
import { initialStackTemplates, defaultNewStack } from './templates';
import { Edge, Node } from 'reactflow';
import { PlayIcon, ChatIcon, SunIcon, MoonIcon } from './components/icons';

export interface Stack {
  id: string;
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
}

// Function to get the initial theme from localStorage or default to 'dark'
const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedPrefs = window.localStorage.getItem('genai-stack-theme');
    if (storedPrefs === 'light' || storedPrefs === 'dark') {
      return storedPrefs;
    }
  }
  return 'dark';
};



function App() {
  const [stacks, setStacks] = useState<Stack[]>(initialStackTemplates);
  const [currentStackId, setCurrentStackId] = useState<string | null>(null);
  const [isNewStackModalOpen, setNewStackModalOpen] = useState(false);
  const [isChatModalOpen, setChatModalOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);

  // State to trigger actions in the child editor component
  const [saveTrigger, setSaveTrigger] = useState(0);
  const [runTrigger, setRunTrigger] = useState(0);

  // Effect to apply the theme class to the body and save preference
  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(`${theme}-theme`);
    localStorage.setItem('genai-stack-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const currentStack = stacks.find(s => s.id === currentStackId) || null;
  const view = currentStack ? 'editor' : 'list';

  const handleEditStack = (stackId: string) => {
    setCurrentStackId(stackId);
  };

  const handleCreateStack = (name: string, description: string) => {
    const newStack: Stack = {
      ...defaultNewStack,
      id: `stack-${Date.now()}`,
      name,
      description,
    };
    setStacks(prev => [...prev, newStack]);
    setNewStackModalOpen(false);
  };

  const backToStacks = () => {
    setCurrentStackId(null);
  };

  const handleSaveStack = useCallback((updatedNodes: Node[], updatedEdges: Edge[]) => {
    if (!currentStackId) return;

    setStacks(prevStacks =>
      prevStacks.map(s =>
        s.id === currentStackId ? { ...s, nodes: updatedNodes, edges: updatedEdges } : s
      )
    );
    // Here you could add a toast notification like "Stack Saved!"
    console.log("Stack saved!");
  }, [currentStackId]);

  const triggerSave = () => setSaveTrigger(t => t + 1);
  const triggerRun = () => setRunTrigger(t => t + 1);

  return (
    <div className="app-container">
      {isNewStackModalOpen && <NewStackModal onClose={() => setNewStackModalOpen(false)} onCreate={handleCreateStack} />}
      {isChatModalOpen && <ChatModal onClose={() => setChatModalOpen(false)} />}

      <header className="header">
        <div className="header-left">
          <div className="logo" onClick={backToStacks}>
            <div className="logo-icon"></div> GenAI Stack
          </div>
          {view === 'editor' && currentStack && (
            <h2 className="stack-name-header">
              / <span>{currentStack.name}</span>
            </h2>
          )}
        </div>
        <div className="header-right">
          {view === 'editor' ? (
            <>
              <button className="btn btn-secondary" onClick={triggerSave}>Save</button>
              <button className="btn btn-secondary" onClick={() => setChatModalOpen(true)}>
                <ChatIcon width={16} height={16} /> Chat with Stack
              </button>
              <button className="btn btn-success" onClick={triggerRun}>
                <PlayIcon width={16} height={16} /> Run
              </button>
            </>
          ) : (
            <button className="btn btn-secondary">Docs</button>
          )}
          <button className="btn btn-secondary theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

        </div>
      </header>

      {view === 'list' ? (
        <StacksListView
          stacks={stacks}
          onEditStack={handleEditStack}
          onNewStack={() => setNewStackModalOpen(true)}
        />
      ) : currentStack ? (
        <WorkflowEditorView
          key={currentStack.id} // Add key to force re-mount on stack change
          initialNodes={currentStack.nodes}
          initialEdges={currentStack.edges}
          onSave={handleSaveStack}
          saveTrigger={saveTrigger}
          runTrigger={runTrigger}
        />
      ) : null}
    </div>
  );
}

export default App;