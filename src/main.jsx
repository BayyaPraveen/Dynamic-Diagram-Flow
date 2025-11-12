import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { FlowProvider } from './context/FlowContext';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FlowProvider>
      <App />
    </FlowProvider>
  </React.StrictMode>
);
