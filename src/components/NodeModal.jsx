import React, { useEffect, useState } from 'react';
import { useFlow } from '../context/FlowContext';

export default function NodeModal({ open, onClose, node }) {
  const { addNode, updateNode } = useFlow();
  const [title, setTitle] = useState('');
  const [color, setColor] = useState('#0ea5a4');
  const [x, setX] = useState(200);
  const [y, setY] = useState(200);

  useEffect(() => {
    if (node) {
      setTitle(node.data?.title || '');
      setColor(node.data?.color || '#0ea5a4');
      setX(node.position?.x || 200);
      setY(node.position?.y || 200);
    } else {
      setTitle('');
      setColor('#0ea5a4');
      setX(200);
      setY(200);
    }
  }, [node]);

  const handleSave = () => {
    if (!title.trim()) return alert('Title required');
    if (node) {
      updateNode(node.id, { position: { x: Number(x), y: Number(y) }, data: { ...node.data, title, color } });
    } else {
      const id = `${Date.now()}`;
      addNode({ id, type: 'custom', position: { x: Number(x), y: Number(y) }, data: { title, color } });
    }
    onClose();
  };

  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h4>{node ? 'Edit Node' : 'Add Node'}</h4>
        <label>Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} />
        <label>Color</label>
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="#ef4444">Red</option>
          <option value="#10b981">Green</option>
          <option value="#3b82f6">Blue</option>
          <option value="#f59e0b">Orange</option>
          <option value="#6b7280">Gray</option>
        </select>
        <label>Position X</label>
        <input type="number" value={x} onChange={e => setX(e.target.value)} />
        <label>Position Y</label>
        <input type="number" value={y} onChange={e => setY(e.target.value)} />
        <div className="modal-actions">
          <button onClick={handleSave}>Save</button>
          <button className="muted" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
