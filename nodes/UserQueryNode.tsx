import React, { useCallback } from 'react';
import { NodeProps, Position } from 'reactflow';
import { NodeWrapper } from './NodeWrapper';
import { CustomHandle } from './CustomHandle';
import { UserQueryNodeData } from '../src/types/nodeTypes';

interface UserQueryNodeProps extends Omit<NodeProps<UserQueryNodeData>, 'selected' | 'type'> {
  id: string;
  data: UserQueryNodeData & {
    onChange?: (nodeId: string, field: string, value: string) => void;
    onDelete?: (nodeId: string) => void;
  };
  selected?: boolean;
}

export const UserQueryNode: React.FC<UserQueryNodeProps> = ({ id, data, selected = false }) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      data.onChange?.(id, 'query', e.target.value);
    },
    [id, data]
  );

  return (
    <NodeWrapper 
      id={id}
      data={data}
      type="userQuery"
      title="User Query"
      selected={selected}
      isConnectable={true}
      xPos={data.xPos || 0}
      yPos={data.yPos || 0}
      zIndex={data.zIndex || 0}
      onDelete={data.onDelete}
      icon="userQuery"
      dragging={data.dragging || false}
    >
      <div className="form-group">
        <label>Enter your query</label>
        <textarea
          value={data.query || ''}
          onChange={handleChange}
          placeholder="Type your query here..."
          className="form-control"
          rows={3}
        />
      </div>
      
      <CustomHandle type="source" position={Position.Bottom} id="query" label="Query" />
    </NodeWrapper>
  );
};

export default UserQueryNode;
