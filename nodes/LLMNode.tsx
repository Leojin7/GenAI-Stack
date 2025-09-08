import React, { useState } from 'react';
import { Position, NodeProps } from 'reactflow';
import { NodeWrapper } from './NodeWrapper';
import { CustomHandle } from './CustomHandle';
import { EyeIcon, EyeOffIcon } from '../components/icons';
import { LLMNodeData } from '../src/types/nodeTypes';

interface LLMNodeProps extends NodeProps<LLMNodeData> {
  id: string;
  data: LLMNodeData;
}

export const LLMNode: React.FC<LLMNodeProps> = ({ id, data }) => {
  const [isApiKeyVisible, setApiKeyVisible] = useState(false);
  const [isSerfApiKeyVisible, setSerfApiKeyVisible] = useState(false);

  const toggleApiKeyVisibility = () => setApiKeyVisible(!isApiKeyVisible);
  const toggleSerfApiKeyVisibility = () => setSerfApiKeyVisible(!isSerfApiKeyVisible);

  return (
    <NodeWrapper
      id={id}
      title="LLM (OpenAI)"
      type="llm"
      data={data}
      selected={data.selected || false}
      isConnectable={true}
      xPos={data.xPos || 0}
      yPos={data.yPos || 0}
      zIndex={data.zIndex || 0}
      onDelete={data.onDelete}
      dragging={data.dragging || false}
    >
      <p style={{ margin: '0 0 12px', color: '#6C757D' }}>Run a query with OpenAI LLM</p>
      <div className="form-group">
        <label>Model</label>
        <select className="form-control" defaultValue="gpt-4o-mini">
          <option>gpt-4o-mini</option>
        </select>
      </div>
      <div className="form-group">
        <label>API Key</label>
        <div className="password-input">
          <input type={isApiKeyVisible ? 'text' : 'password'} className="form-control" defaultValue="************" />
          <button className="password-toggle" onClick={toggleApiKeyVisibility}>
            {isApiKeyVisible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </div>
      <div className="form-group llm-prompt-group">
        <label>Prompt</label>
        <textarea 
          className="form-control nopan" 
          rows={5} 
          value={data.prompt || "You are a helpful PDF assistant. Use web search if the PDF lacks context\n\nCONTEXT: {context}\nUser Query: {query}"}
          onChange={(e) => data.onChange?.(id, 'prompt', e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Temperature</label>
        <input type="number" className="form-control" defaultValue="0.75" step="0.05" />
      </div>
      <div className="form-group">
        <div className="toggle-switch">
          <label>WebSearch Tool</label>
          <label className="switch">
            <input type="checkbox" defaultChecked={data.webSearchEnabled} />
            <span className="slider"></span>
          </label>
        </div>
      </div>
      {data.webSearchEnabled && (
        <div className="form-group">
          <label>SERF API</label>
          <div className="password-input">
            <input type={isSerfApiKeyVisible ? 'text' : 'password'} className="form-control" defaultValue="************" />
            <button className="password-toggle" onClick={toggleSerfApiKeyVisibility}>
              {isSerfApiKeyVisible ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>
      )}
      <CustomHandle type="target" position={Position.Left} id="query" label="Query" />
      <CustomHandle type="target" position={Position.Left} id="context" label="Context" />
      <CustomHandle type="source" position={Position.Right} id="output" label="Output" />
    </NodeWrapper>
  );
};
