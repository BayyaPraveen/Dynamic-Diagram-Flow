import React, { useCallback, useMemo, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  useEdgesState,
  useNodesState,
  Handle,
  Position,
} from 'react-flow-renderer';
import { useFlow } from '../context/FlowContext';

function CustomNode({ data }) {
  const bg = data?.color || '#111827';
  const border = data?.highlight ? '3px solid rgba(255,255,255,0.85)' : '1px solid rgba(0,0,0,0.06)';
  const boxShadow = data?.highlight ? '0 12px 30px rgba(59,130,246,0.18)' : '0 8px 20px rgba(0,0,0,0.12)';
  return (
    <div style={{
      padding: 10,
      borderRadius: 8,
      minWidth: 120,
      background: bg,
      color: '#fff',
      border,
      boxShadow,
      position: 'relative'
    }}>
      <Handle type="target" position={Position.Top} style={{ background: '#555', width: 12, height: 12, borderRadius: 6 }} />
      <div style={{ fontWeight: 700, textAlign: 'center' }}>{data?.title || data?.label}</div>
      {data?.subtitle && <div style={{ fontSize: 12, opacity: 0.9, marginTop: 6 }}>{data.subtitle}</div>}
      <Handle type="source" position={Position.Bottom} id="a" style={{ background: '#555', width: 12, height: 12, borderRadius: 6 }} />
    </div>
  );
}

export default function FlowCanvas({ onEditNode, onEditEdge }) {
  const {
    nodes: ctxNodes,
    edges: ctxEdges,
    addEdge: ctxAddEdge,
    updateNode,
    removeNode,
    removeEdge,
    updateEdge,
    registerReactFlowInstance,
  } = useFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState(ctxNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(ctxEdges);

  useEffect(() => setNodes(ctxNodes), [ctxNodes]);
  useEffect(() => setEdges(ctxEdges), [ctxEdges]);

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  const onConnect = useCallback((params) => {
    const id = `e${Date.now()}`;
    const newEdge = { id, source: params.source, target: params.target, label: '' };
    ctxAddEdge(newEdge);

    const sourceColor = '#ef4444';
    const targetColor = '#10b981';

    if (params.source) {
      updateNode(params.source, {
        data: { ...(ctxNodes.find(n => n.id === params.source)?.data || {}), color: sourceColor }
      });
    }
    if (params.target) {
      updateNode(params.target, {
        data: { ...(ctxNodes.find(n => n.id === params.target)?.data || {}), color: targetColor }
      });
    }
  }, [ctxAddEdge, ctxNodes, updateNode]);

  const onNodeDoubleClick = useCallback((ev, node) => {
    onEditNode && onEditNode(node);
  }, [onEditNode]);

  const onEdgeDoubleClick = useCallback((ev, edge) => {
    const newLabel = window.prompt('Edit edge label', edge.label || '');
    if (newLabel !== null) updateEdge(edge.id, { ...edge, label: newLabel });
    onEditEdge && onEditEdge(edge);
  }, [onEditEdge, updateEdge]);

  const onSelectionChange = useCallback(({ nodes: selectedNodes, edges: selectedEdges }) => {
    ctxNodes.forEach(n => {
      if (n.data?.highlight) updateNode(n.id, { data: { ...n.data, highlight: false } });
    });

    if (selectedEdges && selectedEdges.length) {
      selectedEdges.forEach(se => {
        const edge = ctxEdges.find(e => e.id === se.id);
        if (!edge) return;
        if (edge.source) updateNode(edge.source, { data: { ...(ctxNodes.find(n => n.id === edge.source)?.data || {}), highlight: true } });
        if (edge.target) updateNode(edge.target, { data: { ...(ctxNodes.find(n => n.id === edge.target)?.data || {}), highlight: true } });
      });
    }

    if (selectedNodes && selectedNodes.length) {
      selectedNodes.forEach(sn => updateNode(sn.id, { data: { ...(ctxNodes.find(n => n.id === sn.id)?.data || {}), highlight: true } }));
    }
  }, [ctxNodes, ctxEdges, updateNode]);

  const onNodesDelete = useCallback((deleted) => {
    deleted.forEach(d => removeNode(d.id));
  }, [removeNode]);

  const onEdgesDelete = useCallback((deleted) => {
    deleted.forEach(d => removeEdge(d.id));
  }, [removeEdge]);

  const onInit = useCallback((rfi) => {
    if (registerReactFlowInstance) registerReactFlowInstance(rfi);
  }, [registerReactFlowInstance]);

  return (
    <div className="canvas-area" style={{ height: '100%', width: '100%' }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges.map(edge => ({
            ...edge,
            label: edge.label || '',
            labelBgPadding: [6, 4],
            labelBgBorderRadius: 4,
            labelBgStyle: { fill: '#fff', color: '#000', fillOpacity: 0.9 },
            labelStyle: { fontWeight: 600, fontSize: 12 },
          }))}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodeDoubleClick={onNodeDoubleClick}
          onEdgeDoubleClick={onEdgeDoubleClick}
          onSelectionChange={onSelectionChange}
          onNodesDelete={onNodesDelete}
          onEdgesDelete={onEdgesDelete}
          onInit={onInit}
          fitView
          deleteKeyCode={46}
        >
          <MiniMap nodeStrokeColor={n => n.data?.color || '#333'} nodeColor={n => n.data?.color || '#fff'} />
          <Controls />
          <Background gap={16} />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
