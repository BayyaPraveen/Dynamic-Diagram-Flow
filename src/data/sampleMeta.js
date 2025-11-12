// src/data/sampleMeta.js
export const sampleMeta = {
  nodes: [
    { id: 'n1', type: 'custom', position: { x: 40,  y: 60  }, data: { title: 'Ingest',            color: '#ef4444', subtitle: 'n1' } },
    { id: 'n2', type: 'custom', position: { x: 320, y: 60  }, data: { title: 'Validate',          color: '#f59e0b', subtitle: 'n2' } },
    { id: 'n3', type: 'custom', position: { x: 600, y: 60  }, data: { title: 'Transform',         color: '#3b82f6', subtitle: 'n3' } },
    { id: 'n4', type: 'custom', position: { x: 880, y: 60  }, data: { title: 'Store',             color: '#10b981', subtitle: 'n4' } },

    { id: 'n5', type: 'custom', position: { x: 180, y: 220 }, data: { title: 'Auth',              color: '#a78bfa', subtitle: 'n5' } },
    { id: 'n6', type: 'custom', position: { x: 460, y: 220 }, data: { title: 'Queue',             color: '#06b6d4', subtitle: 'n6' } },
    { id: 'n7', type: 'custom', position: { x: 740, y: 220 }, data: { title: 'Worker',            color: '#fb7185', subtitle: 'n7' } },

    { id: 'n8',  type: 'custom', position: { x: 100, y: 380 }, data: { title: 'API Gateway',       color: '#ef4444', subtitle: 'n8' } },
    { id: 'n9',  type: 'custom', position: { x: 380, y: 380 }, data: { title: 'Microservice A',    color: '#3b82f6', subtitle: 'n9' } },
    { id: 'n10', type: 'custom', position: { x: 660, y: 380 }, data: { title: 'Microservice B',    color: '#10b981', subtitle: 'n10' } },
    { id: 'n11', type: 'custom', position: { x: 940, y: 380 }, data: { title: 'Notifications',     color: '#f59e0b', subtitle: 'n11' } },

    // a hub node
    { id: 'n12', type: 'custom', position: { x: 520, y: 520 }, data: { title: 'Dashboard', color: '#6b7280', subtitle: 'n12' } },
  ],

  edges: [
    { id: 'e1', source: 'n1',  target: 'n2',  label: 'ingest→validate',   type: 'smoothstep' },
    { id: 'e2', source: 'n2',  target: 'n3',  label: 'validate→transform', type: 'smoothstep' },
    { id: 'e3', source: 'n3',  target: 'n4',  label: 'transform→store',    type: 'smoothstep' },

    { id: 'e4', source: 'n2',  target: 'n6',  label: 'push→queue',         type: 'smoothstep' },
    { id: 'e5', source: 'n6',  target: 'n7',  label: 'queue→worker',       type: 'smoothstep' },
    { id: 'e6', source: 'n7',  target: 'n11', label: 'worker→notify',      type: 'smoothstep' },

    { id: 'e7', source: 'n8',  target: 'n9',  label: 'gateway→svcA',       type: 'smoothstep' },
    { id: 'e8', source: 'n9',  target: 'n12', label: 'svcA→dashboard',     type: 'smoothstep' },
    { id: 'e9', source: 'n10', target: 'n12', label: 'svcB→dashboard',     type: 'smoothstep' },
    { id: 'e10', source: 'n11', target: 'n12', label: 'notify→dashboard',   type: 'smoothstep' },

    // cross links
    { id: 'e11', source: 'n4',  target: 'n10', label: 'store→svcB',         type: 'smoothstep' },
    { id: 'e12', source: 'n5',  target: 'n6',  label: 'auth→queue',         type: 'smoothstep' },
  ],
};
