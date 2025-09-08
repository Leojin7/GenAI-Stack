import React, { useState } from 'react';
import { CloseIcon } from './icons';

interface NewStackModalProps {
  onClose: () => void;
  onCreate: (name: string, description: string) => void;
}

export const NewStackModal: React.FC<NewStackModalProps> = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    if (name.trim()) {
      onCreate(name, description);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Stack</h2>
          <button className="close-btn" onClick={onClose}><CloseIcon /></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input 
              type="text" 
              id="name" 
              className="form-control" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., PDF Analyzer"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea 
              id="description" 
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., A workflow to summarize PDF documents."
            ></textarea>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleCreate}>Create Stack</button>
        </div>
      </div>
    </div>
  );
};
