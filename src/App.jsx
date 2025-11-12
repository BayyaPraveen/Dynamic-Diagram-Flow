import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import FlowCanvas from './components/FlowCanvas';
import NodeModal from './components/NodeModal';
import EdgeModal from './components/EdgeModal';
import { useFlow } from './context/FlowContext';

export default function App() {
  const { nodes, edges, updateNode, updateEdge } = useFlow();

  const [nodeModalOpen, setNodeModalOpen] = useState(false);
  const [edgeModalOpen, setEdgeModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState(null);
  const [editingEdge, setEditingEdge] = useState(null);

  const openNodeForm = (node = null) => { setEditingNode(node); setNodeModalOpen(true); };
  const openEdgeForm = (edge = null) => { setEditingEdge(edge); setEdgeModalOpen(true); };

  return (
    <div className="app-root">
      <Sidebar openNodeForm={() => openNodeForm(null)} openEdgeForm={() => openEdgeForm(null)} />

      <main className="main-area">
        <FlowCanvas onEditNode={(n) => openNodeForm(n)} onEditEdge={(e) => openEdgeForm(e)} />
      </main>

      <NodeModal open={nodeModalOpen} onClose={() => setNodeModalOpen(false)} node={editingNode} />
      <EdgeModal open={edgeModalOpen} onClose={() => setEdgeModalOpen(false)} edge={editingEdge} />
    </div>
  );
}
