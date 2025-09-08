import React from 'react';
import { PlusIcon, ExternalLinkIcon } from '../components/icons';
import { Stack } from '../App';

interface StacksListViewProps {
  stacks: Stack[];
  onEditStack: (id: string) => void;
  onNewStack: () => void;
}

export const StacksListView: React.FC<StacksListViewProps> = ({ stacks, onEditStack, onNewStack }) => {
  return (
    <div className="main-content">
      <div className="page-header">
          <h1 className="page-title">My Stacks</h1>
          <button className="btn btn-primary" onClick={onNewStack}><PlusIcon/> New Stack</button>
      </div>
      <div className="stacks-grid">
        {stacks.map((stack) => (
          <div key={stack.id} className="stack-card">
            <h3>{stack.name}</h3>
            <p>{stack.description}</p>
            <div className="stack-card-footer">
                <button className="btn edit-stack-btn" onClick={() => onEditStack(stack.id)}>Edit Stack <ExternalLinkIcon/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
