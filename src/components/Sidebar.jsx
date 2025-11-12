import React, { useState, useRef } from 'react';
import { useFlow } from '../context/FlowContext';

export default function Sidebar({ openNodeForm, openEdgeForm }) {
  const { nodes, exportMeta, addNodes, importMeta } = useFlow();
  const [count, setCount] = useState(3);
  const [prefix, setPrefix] = useState('N');
  const [connectSequential, setConnectSequential] = useState(true);
  const [connectToExisting, setConnectToExisting] = useState(false);
  const [color, setColor] = useState('#6b7280');
  const fileRef = useRef();

  const handleAdd = (c) => {
    const startY = nodes.length ? Math.max(...nodes.map(n => n.position?.y || 0)) + 120 : 120;
    const startX = 120;
    addNodes(c, {
      prefix,
      startPosition: { x: startX, y: startY },
      spacing: { dx: 180, dy: 0 },
      connectSequential,
      connectToExisting,
      color,
    });
  };

  const handleFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const txt = await f.text();
      const parsed = JSON.parse(txt);
      importMeta(parsed);
    } catch (err) {
      alert('Invalid JSON file');
    }
    e.target.value = null;
  };

  return (
    <aside className="sidebar">
      <h3>Controls</h3>

      <div className="section">
        <button onClick={() => openNodeForm()}>+ Add Single Node</button>
        <button onClick={() => openEdgeForm()} style={{ marginLeft: 8 }}>+ Add Edge</button>
      </div>

      <div className="section">
        <div style={{ marginBottom: 6 }}>Add multiple nodes quickly</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
          <input type="number" min="1" value={count} onChange={(e) => setCount(Number(e.target.value))} style={{ width: 72, padding: 6 }} />
          <input value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="Prefix" style={{ width: 80, padding: 6 }} />
          <select value={color} onChange={(e) => setColor(e.target.value)} style={{ padding: 6 }}>
            <option value="#ef4444">Red</option>
            <option value="#10b981">Green</option>
            <option value="#3b82f6">Blue</option>
            <option value="#f59e0b">Orange</option>
            <option value="#6b7280">Gray</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
          <label><input type="checkbox" checked={connectSequential} onChange={e => setConnectSequential(e.target.checked)} /> Connect sequential</label>
          <label style={{ marginLeft: 8 }}><input type="checkbox" checked={connectToExisting} onChange={e => setConnectToExisting(e.target.checked)} /> Connect to existing</label>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => handleAdd(1)}>Add 1</button>
          <button onClick={() => handleAdd(3)}>Add 3</button>
          <button onClick={() => handleAdd(5)}>Add 5</button>
          <button onClick={() => handleAdd(count)}>Add {count}</button>
        </div>
      </div>

      <hr />

      <div className="section">
        <button onClick={() => {
          const json = exportMeta();
          const blob = new Blob([json], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a'); a.href = url; a.download = 'diagram.json'; a.click(); URL.revokeObjectURL(url);
        }}>Export JSON</button>

        <button style={{ marginLeft: 8 }} onClick={() => { localStorage.removeItem('flow:meta'); window.location.reload(); }}>Reset to Sample</button>
      </div>

      <div className="section" style={{ marginTop: 12 }}>
        <label className="small">Import JSON</label>
        <input ref={fileRef} type="file" accept=".json,application/json" onChange={handleFile} />
      </div>
    </aside>
  );
}
