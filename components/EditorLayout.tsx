import React, { useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { useTheme } from '../src/providers/ThemeProvider';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Sidebar } from './Sidebar';
import { RightPanel } from './RightPanel';
import { TopBar } from './TopBar';
import '../src/styles/editor.css';

interface EditorLayoutProps {
  children: React.ReactNode;
}

export const EditorLayout: React.FC<EditorLayoutProps> = ({ children }) => {
  const { colors, isDark, toggleTheme } = useTheme();

  useEffect(() => {
    if (!isDark) {
      toggleTheme();
    }
  }, []);

  return (
    <div
      className={`editor-layout ${isDark ? 'dark' : ''}`}
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <TopBar />

      <div className="editor-content" style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <ReactFlowProvider>
          <PanelGroup direction="horizontal" style={{ width: '100%' }}>
            {/* Left Sidebar - Node Palette */}
            <Panel
              defaultSize={250}
              minSize={200}
              maxSize={350}
              style={{
                backgroundColor: colors.surface,
                borderRight: `1px solid ${colors.border}`,
                padding: '1rem',
                overflowY: 'auto'
              }}
            >
              <Sidebar />
            </Panel>

            <PanelResizeHandle className="resize-handle" />

            {/* Main Canvas Area */}
            <Panel style={{ position: 'relative' }}>
              {children}
            </Panel>

            <PanelResizeHandle className="resize-handle" />

            {/* Right Panel - Node Configuration */}
            <Panel
              defaultSize={300}
              minSize={250}
              maxSize={400}
              style={{
                backgroundColor: colors.surface,
                borderLeft: `1px solid ${colors.border}`,
                overflowY: 'auto'
              }}
            >
              <RightPanel />
            </Panel>
          </PanelGroup>
        </ReactFlowProvider>
      </div>
    </div>
  );
};
