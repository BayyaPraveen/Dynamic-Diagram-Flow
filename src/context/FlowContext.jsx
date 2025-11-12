import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { sampleMeta } from '../data/sampleMeta';

const STORAGE_KEY = 'flow:meta';
const FlowContext = createContext(null);
export const useFlow = () => useContext(FlowContext);

export function FlowProvider({ children }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const reactFlowInstanceRef = useRef(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setNodes(parsed.nodes || []);
        setEdges(parsed.edges || []);
        return;
      }
    } catch (e) {
      // ignore parse errors
    }
    setNodes(sampleMeta.nodes || []);
    setEdges(sampleMeta.edges || []);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, edges }));
    } catch (e) {}
  }, [nodes, edges]);

  // Node helpers
  const addNode = (node) => setNodes((nds) => [...nds, node]);
  const updateNode = (id, patch) => setNodes((nds) => nds.map(n => n.id === id ? { ...n, ...patch } : n));
  const removeNode = (id) => {
    setNodes((nds) => nds.filter(n => n.id !== id));
    setEdges((eds) => eds.filter(e => e.source !== id && e.target !== id));
  };

  // Edge helpers
  const addEdge = (edge) => setEdges((eds) => [...eds, edge]);
  const updateEdge = (id, patch) => setEdges((eds) => eds.map(e => e.id === id ? { ...e, ...patch } : e));
  const removeEdge = (id) => setEdges((eds) => eds.filter(e => e.id !== id));

  const registerReactFlowInstance = (instance) => {
    reactFlowInstanceRef.current = instance;
  };

  // Bulk add nodes
  const addNodes = (count = 3, opts = {}) => {
    const {
      prefix = 'N',
      startPosition = { x: 200, y: 200 },
      spacing = { dx: 220, dy: 0 },
      connectSequential = false,
      connectToExisting = false,
      color = '#6b7280',
    } = opts;

    if (!Number.isFinite(count) || count <= 0) return;

    const newNodes = [];
    const newEdges = [];
    const now = Date.now();

    for (let i = 0; i < count; i++) {
      const id = `${prefix}${now}_${i}`;
      const pos = { x: startPosition.x + i * spacing.dx, y: startPosition.y + i * spacing.dy };
      const title = `${prefix}_${i + 1}`;
      newNodes.push({
        id,
        type: 'custom',
        position: pos,
        data: { title, color }
      });
    }

    if (connectSequential && newNodes.length > 1) {
      for (let i = 0; i < newNodes.length - 1; i++) {
        const eid = `e${now}_s${i}`;
        newEdges.push({ id: eid, source: newNodes[i].id, target: newNodes[i + 1].id, label: '' });
      }
    }

    if (connectToExisting && nodes.length > 0) {
      const lastExisting = nodes[nodes.length - 1];
      if (lastExisting) {
        const eid = `e${now}_c`;
        newEdges.push({ id: eid, source: lastExisting.id, target: newNodes[0].id, label: '' });
      }
    }

    setNodes((nds) => [...nds, ...newNodes]);
    setEdges((eds) => [...eds, ...newEdges]);

    // fit view after adding
    setTimeout(() => {
      const inst = reactFlowInstanceRef.current;
      if (inst && typeof inst.fitView === 'function') {
        try { inst.fitView({ padding: 0.1 }); } catch (e) {}
      }
    }, 120);
  };

  const importMeta = (meta) => {
    setNodes(meta.nodes || []);
    setEdges(meta.edges || []);
  };
  const exportMeta = () => JSON.stringify({ nodes, edges }, null, 2);

  return (
    <FlowContext.Provider value={{
      nodes, edges,
      addNode, addNodes, updateNode, removeNode,
      addEdge, updateEdge, removeEdge,
      importMeta, exportMeta,
      registerReactFlowInstance,
    }}>
      {children}
    </FlowContext.Provider>
  );
}
