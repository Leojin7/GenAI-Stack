import React from 'react';
import { Position, NodeProps } from 'reactflow';
import { NodeWrapper } from './NodeWrapper';
import { CustomHandle } from './CustomHandle';
import { OutputNodeData } from '../src/types/nodeTypes';

interface OutputNodeProps extends NodeProps<OutputNodeData> {
  id: string;
  data: OutputNodeData & {
    onDelete?: (nodeId: string) => void;
  };
}

export const OutputNode: React.FC<OutputNodeProps> = ({ id, data }) => (
  <NodeWrapper 
    id={id} 
    title="Output" 
    type="output" 
    data={data}
    selected={data.selected || false}
    isConnectable={true}
    xPos={data.xPos || 0}
    yPos={data.yPos || 0}
    zIndex={data.zIndex || 0}
    onDelete={data.onDelete}
    dragging={data.dragging || false}
  >
    <p style={{ margin: '0 0 12px', color: '#6C757D' }}>Output of the result as nodes text</p>
    <div className="form-group" style={{flexGrow: 1}}>
      <label>Output Text</label>
       <div className="output-text-display nopan">
        {data.isLoading ? 'Generating...' : (data.result || 'Output will be generated based on query')}
      </div>
    </div>
    <CustomHandle type="target" position={Position.Left} id="output" label="Output" />
  </NodeWrapper>
);
