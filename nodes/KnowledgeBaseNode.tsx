import React, { useState, useRef } from 'react';
import { Position, NodeProps } from 'reactflow';
import { NodeWrapper } from './NodeWrapper';
import { CustomHandle } from './CustomHandle';
import { TrashIcon, EyeIcon, EyeOffIcon } from '../components/icons';
import { KnowledgeBaseNodeData } from '../src/types/nodeTypes';

interface KnowledgeBaseNodeProps extends NodeProps<KnowledgeBaseNodeData> {
  id: string;
  data: KnowledgeBaseNodeData & {
    onChange: (nodeId: string, field: string, value: any) => void;
    onDelete?: (nodeId: string) => void;
  };
}

export const KnowledgeBaseNode: React.FC<KnowledgeBaseNodeProps> = ({ id, data }) => {
  const [isApiKeyVisible, setApiKeyVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleApiKeyVisibility = () => {
    setApiKeyVisible(!isApiKeyVisible);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      data.onChange(id, 'fileName', event.target.files[0].name);
    }
  };
  
  const handleDeleteFile = () => {
      data.onChange(id, 'fileName', null);
  };

  return (
    <NodeWrapper 
      id={id} 
      title="Knowledge Base" 
      type="knowledgeBase" 
      data={data}
      selected={data.selected || false}
      isConnectable={true}
      xPos={data.xPos || 0}
      yPos={data.yPos || 0}
      zIndex={data.zIndex || 0}
      onDelete={data.onDelete}
      dragging={data.dragging || false}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        style={{ display: 'none' }}
      />
      <p style={{ margin: '0 0 12px', color: '#6C757D' }}>Let LLM search info in your file</p>
      <div className="form-group">
          <label>File for Knowledge Base</label>
          { data.fileName ? (
            <div className="uploaded-file">
              <span>{data.fileName}</span>
              <button onClick={handleDeleteFile}><TrashIcon/></button>
            </div>
          ) : (
            <div className="upload-box" onClick={handleUploadClick}>
              <span>+ Upload File</span>
            </div>
          )}
      </div>
      <div className="form-group">
        <label>Embedding Model</label>
        <select className="form-control" defaultValue="text-embedding-3-large">
          <option>text-embedding-3-large</option>
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
      <CustomHandle type="target" position={Position.Left} id="query" label="Query" />
      <CustomHandle type="source" position={Position.Right} id="context" label="Context" />
    </NodeWrapper>
  );
};