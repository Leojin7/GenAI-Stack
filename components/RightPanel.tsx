import React from 'react';
import { useTheme } from '../src/providers/ThemeProvider';

interface RightPanelProps {
  selectedNode?: {
    id: string;
    type: string;
    data: any;
  };
}

export const RightPanel: React.FC<RightPanelProps> = ({ selectedNode }) => {
  const { colors } = useTheme();

  if (!selectedNode) {
    return (
      <div className="config-panel">
        <h2>No Node Selected</h2>
        <p className="text-muted">Select a node to configure its properties</p>
      </div>
    );
  }

  return (
    <div className="config-panel">
      <h2>Node Properties</h2>
      
      <div className="config-section">
        <h3>Configuration</h3>
        
        <div className="form-group">
          <label>Node Type</label>
          <div className="form-control">
            {selectedNode.type}
          </div>
        </div>
        
        <div className="form-group">
          <label>Node ID</label>
          <div className="form-control">
            {selectedNode.id}
          </div>
        </div>
        
        {selectedNode.type === 'llm' && (
          <div className="form-group">
            <label>Model</label>
            <select className="form-control" defaultValue="gpt-4">
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="gemini-pro">Gemini Pro</option>
            </select>
          </div>
        )}
        
        {selectedNode.type === 'knowledgeBase' && (
          <div className="form-group">
            <label>Knowledge Base</label>
            <select className="form-control" defaultValue="default">
              <option value="default">Default Knowledge Base</option>
              <option value="custom">Custom Collection</option>
            </select>
          </div>
        )}
        
        <div className="form-group">
          <label>Notes</label>
          <textarea 
            className="form-control" 
            rows={3} 
            placeholder="Add notes about this node..."
            style={{ resize: 'vertical' }}
          />
        </div>
      </div>
      
      <div className="config-section">
        <h3>Advanced</h3>
        <div className="form-group">
          <label>
            <input type="checkbox" /> Enable Debug Mode
          </label>
        </div>
      </div>
      
      <div className="mt-auto pt-4 border-t border-border">
        <button className="btn btn-primary w-full">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default RightPanel;
