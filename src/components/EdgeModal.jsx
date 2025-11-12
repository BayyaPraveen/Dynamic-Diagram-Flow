import React, { useEffect, useState } from 'react';
import { useFlow } from '../context/FlowContext';

export default function EdgeModal({ open, onClose, edge }) {
  const { nodes, addEdge, updateEdge } = useFlow();
  const [source, setSource] = useState('');
  const [target, setTarget] = useState('');
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (edge) {
      setSource(edge.source || '');
      setTarget(edge.target || '');
      setLabel(edge.label || '');
    } else {
      setSource(nodes[0]?.id || '');
      setTarget(nodes[1]?.id || '');
      setLabel('');
    }
  }, [edge, nodes]);

  const handleSave = () => {
    if (!source || !target) return alert('Choose source & target');
    if (edge) {
      updateEdge(edge.id, { source, target, label });
    } else {
      const id = `e${Date.now()}`;
      addEdge({ id, source, target, label });
    }
    onClose();
  };

  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h4>{edge ? 'Edit Edge' : 'Add Edge'}</h4>
        <label>Source</label>
        <select value={source} onChange={e => setSource(e.target.value)}>
          {nodes.map(n => <option key={n.id} value={n.id}>{n.data?.title || n.id}</option>)}
        </select>
        <label>Target</label>
        <select value={target} onChange={e => setTarget(e.target.value)}>
          {nodes.map(n => <option key={n.id} value={n.id}>{n.data?.title || n.id}</option>)}
        </select>
        <label>Label</label>
        <input value={label} onChange={e => setLabel(e.target.value)} />
        <div className="modal-actions">
          <button onClick={handleSave}>Save</button>
          <button className="muted" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
